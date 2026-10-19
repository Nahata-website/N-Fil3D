// Pulls products, categories and blog posts from the live WooCommerce/WordPress site
// and writes them to src/data/*.json. Run: npm run sync
// Requires Node 18+ (global fetch). Uses only public endpoints.
import { writeFile, readFile, mkdir } from 'node:fs/promises';

const STORE = process.env.STORE_URL || 'https://nfil3d.com';
const OUT = new URL('../src/data/', import.meta.url);

async function getAll(path) {
  const out = [];
  for (let page = 1; page < 50; page++) {
    const sep = path.includes('?') ? '&' : '?';
    const res = await fetch(`${STORE}${path}${sep}per_page=100&page=${page}`, { headers: { 'User-Agent': 'nfil3d-sync' } });
    if (!res.ok) break;
    const chunk = await res.json();
    if (!Array.isArray(chunk) || !chunk.length) break;
    out.push(...chunk);
    if (chunk.length < 100) break;
  }
  return out;
}

const decode = (s = '') => s
  .replace(/&#8211;|&ndash;/g, '–').replace(/&#8217;|&rsquo;/g, '’').replace(/&#038;|&amp;/g, '&')
  .replace(/&#8220;|&#8221;|&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/&#215;/g, '×').replace(/&#8377;/g, '₹');

// Clean marketplace HTML: one H1 per page (ours), no injected plugin text, no inline styles.
export function cleanHtml(html = '') {
  return html
    .replace(/<h1([^>]*)>/gi, '<h2>').replace(/<\/h1>/gi, '</h2>')
    .replace(/Thank you for reading this post, don['’]t forget to subscribe!?/gi, '')
    .replace(/Add to Wishlist/gi, '')
    .replace(/\s(style|class|id|data-[\w-]+)="[^"]*"/gi, '')
    .replace(/<span>(.*?)<\/span>/gis, '$1')
    .replace(/<p>\s*(&nbsp;)?\s*<\/p>/gi, '')
    .replace(/https?:\/\/(www\.)?[a-z0-9-]+\.hostingersite\.com/gi, 'https://nfil3d.com')
    .trim();
}

const pathOf = (url) => new URL(url).pathname;

async function main() {
  await mkdir(OUT, { recursive: true });
  let seo = {};
  try { seo = JSON.parse(await readFile(new URL('seo.json', OUT), 'utf8')); } catch {}

  const [rawProducts, rawCats] = await Promise.all([
    getAll('/wp-json/wc/store/v1/products'),
    getAll('/wp-json/wc/store/v1/products/categories'),
  ]);

  const categories = rawCats.map((c) => ({
    id: c.id, name: decode(c.name), slug: c.slug, parent: c.parent, count: c.count,
    path: pathOf(c.permalink), image: c.image?.src || null,
    ...(seo.categories?.[c.id] || {}),
  }));

  const products = rawProducts.map((p) => {
    const s = seo.products?.[p.id] || {};
    const div = 10 ** (p.prices.currency_minor_unit ?? 2);
    return {
      id: p.id, slug: p.slug, path: pathOf(p.permalink), name: decode(p.name),
      shortName: s.shortName || decode(p.name),
      sku: p.sku || null,
      price: Number(p.prices.price) / div,
      regularPrice: Number(p.prices.regular_price) / div,
      onSale: p.on_sale, inStock: p.is_in_stock, purchasable: p.is_purchasable,
      rating: Number(p.average_rating) || 0, reviewCount: p.review_count || 0,
      categories: p.categories.map((c) => c.id),
      images: p.images.map((i, n) => ({ src: i.src, srcset: i.srcset, sizes: i.sizes, alt: i.alt || (n ? `${s.alt || decode(p.name)}, view ${n + 1}` : (s.alt || decode(p.name))) })),
      short: cleanHtml(p.short_description),
      description: cleanHtml(p.description),
      attributes: p.attributes?.map((a) => ({ name: a.name, terms: a.terms.map((t) => t.name) })) || [],
      seoTitle: s.title || null, seoDescription: s.description || null,
    };
  });

  const posts = (await getAll('/wp-json/wp/v2/posts?_embed=1')).map((p) => ({
    id: p.id, slug: p.slug, path: pathOf(p.link), title: decode(p.title.rendered),
    date: p.date, modified: p.modified,
    excerpt: decode(p.excerpt.rendered.replace(/<[^>]+>/g, '')).replace(/Thank you for reading this post, don['’]t forget to subscribe!?/gi, '').trim(),
    content: cleanHtml(p.content.rendered),
    image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    ...(seo.posts?.[p.id] || {}),
  }));

  await writeFile(new URL('products.json', OUT), JSON.stringify(products, null, 1));
  await writeFile(new URL('categories.json', OUT), JSON.stringify(categories, null, 1));
  await writeFile(new URL('posts.json', OUT), JSON.stringify(posts, null, 1));
  console.log(`Synced ${products.length} products, ${categories.length} categories, ${posts.length} posts from ${STORE}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
