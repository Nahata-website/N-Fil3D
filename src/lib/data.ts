import productsRaw from '../data/products.json';
import categoriesRaw from '../data/categories.json';
import postsRaw from '../data/posts.json';

export type Img = { src: string; srcset?: string; sizes?: string; alt: string };
export type Product = {
  id: number; slug: string; path: string; name: string; shortName: string; sku: string | null;
  price: number; regularPrice: number; onSale: boolean; inStock: boolean; purchasable: boolean;
  rating: number; reviewCount: number; categories: number[]; images: Img[];
  short: string; description: string; attributes: { name: string; terms: string[] }[];
  seoTitle: string | null; seoDescription: string | null;
};
export type Category = {
  id: number; name: string; slug: string; parent: number; count: number; path: string; image: string | null;
  seoTitle?: string; seoDescription?: string; intro?: string;
};
export type Post = {
  id: number; slug: string; path: string; title: string; date: string; modified: string;
  excerpt: string; content: string; image: string | null; seoTitle?: string; seoDescription?: string; keyword?: string;
};

const tidy = (h: string) => h
  .replace(/Add to Wishlist/gi, '')
  .replace(/https?:\/\/(www\.)?[a-z0-9-]+\.hostingersite\.com/gi, 'https://nfil3d.com')
  .replace(/<h2>\s*(<strong>)?\s*About this item\s*(<\/strong>)?\s*<\/h2>/gi, '')
  .replace(/<p>\s*<\/p>/g, '').trim();
export const products = (productsRaw as Product[]).map((p) => ({ ...p, slug: decodeURIComponent(p.slug), path: decodeURI(p.path), short: tidy(p.short), description: tidy(p.description) }));
export const categories = categoriesRaw as Category[];
export const posts = (postsRaw as Post[]).map((p) => ({ ...p, slug: decodeURIComponent(p.slug), path: decodeURI(p.path) })).sort((a, b) => b.date.localeCompare(a.date));

// Categories that only duplicate others; kept reachable but not promoted.
export const DUPLICATE_CATS = new Set(['best-seller', 'best-seller-of-3d-pen', 'best-seller-of-3d-pen-filament',
  'best-seller-of-3d-printer-filament', 'best-seller-of-3d-printers', 'pla-1-75', 'rpla', 'nylon']);

export const catById = new Map(categories.map((c) => [c.id, c]));
export const catBySlug = new Map(categories.map((c) => [c.slug, c]));
export const childrenOf = (id: number) => categories.filter((c) => c.parent === id && c.count > 0);
export const descendants = (id: number): number[] => [id, ...childrenOf(id).flatMap((c) => descendants(c.id))];
export const productsIn = (id: number) => {
  const ids = new Set(descendants(id));
  return products.filter((p) => p.categories.some((c) => ids.has(c)));
};
export const ancestors = (c: Category): Category[] => {
  const out: Category[] = [];
  let cur = c.parent ? catById.get(c.parent) : undefined;
  while (cur) { out.unshift(cur); cur = cur.parent ? catById.get(cur.parent) : undefined; }
  return out;
};

/** Most specific, non-duplicate category of a product: used for breadcrumbs and colour families. */
export function primaryCat(p: Product): Category | undefined {
  const cats = p.categories.map((id) => catById.get(id)!).filter((c) => c && !DUPLICATE_CATS.has(c.slug));
  return cats.sort((a, b) => ancestors(b).length - ancestors(a).length)[0] || catById.get(p.categories[0]);
}

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
export const discount = (p: Product) => (p.onSale && p.regularPrice > p.price ? Math.round((1 - p.price / p.regularPrice) * 100) : 0);

// Colour names used across NFIL3D's range → swatch hex.
const COLOURS: [RegExp, string][] = [
  [/raven black|black/i, '#1B1B1B'], [/mid ?night grey/i, '#3C4148'], [/cement grey|grey|gray/i, '#8E8E8E'],
  [/polar white/i, '#EEF1F2'], [/natural white|natural/i, '#EFE9DA'], [/snow white|white|ivory/i, '#F7F7F4'],
  [/porcelain skin|beige/i, '#F1D3BC'], [/mocha brown|brown|wood/i, '#6B4330'], [/strawberry red|clear red|red/i, '#C9252B'],
  [/tangy orange|fluoro orange|clear orange|orange/i, '#EE7A21'], [/daffodil yellow|fluoro yellow|yellow/i, '#F2C230'],
  [/mint green/i, '#8FD3B1'], [/emerald green|clear green|fluoro green|green/i, '#1E8A4C'], [/army green/i, '#4E5B3A'],
  [/electric blue|clear blue|sky blue/i, '#1E7FD8'], [/deep blue|blue/i, '#1F3F8F'], [/purple|orchid/i, '#7B4FA0'],
  [/bubblegum pink|pink/i, '#E86FA2'], [/silver/i, '#B9BBBE'], [/gold/i, '#C9A54A'], [/copper/i, '#B5672E'], [/bronze/i, '#8C5A2B'],
  [/clear glass|glass|clear/i, '#E4EEF0'], [/remix|mix|rainbow|multicolou?r/i, 'conic-gradient(#C9252B,#F2C230,#1E8A4C,#1E7FD8,#C9252B)'],
];
export const swatch = (name: string) => (COLOURS.find(([re]) => re.test(name)) || [null, '#9A968E'])[1];

/** Colour part of a product name, e.g. "Premium HI ABS+ Emerald Green 1.75mm" → "Emerald Green". */
export function colourName(p: Product): string {
  const fam = primaryCat(p);
  let n = p.name.replace(/\b1\.75\s?mm\b/gi, '').replace(/\|/g, ' ');
  n = n.replace(/Premium|HS PLA\+|PLA\+|rPLA\+?|PLA|PETG|HI ABS ?\+|ABS FR|ABS|ASA|HIPS|Nylon|Turbo-Finish|Matte|Ultra Light|Carbon Fiber|–|Glow in the Dark/gi, ' ');
  n = n.replace(/\s+/g, ' ').trim();
  return n && n.length < 28 ? n.replace(/\b\w/g, (m) => m.toUpperCase()).replace(/\bHs\b/, 'HS') : (fam?.name || p.name);
}

/** Other colours of the same product line (same most-specific category). */
export function family(p: Product): Product[] {
  const fam = primaryCat(p);
  if (!fam || /3d-models|3d-printers|fdm|resin|creality|scanner|accessories|elegoo|taulman|speciality|pctpe/.test(fam.slug)) return [p];
  return products.filter((q) => primaryCat(q)?.id === fam.id);
}

export type Material = 'pla' | 'petg' | 'abs' | 'special' | 'pen' | 'printer' | 'other';
export function material(p: Product): Material {
  const slugs = p.categories.map((id) => catById.get(id)?.slug || '');
  if (slugs.some((s) => /3d-printers|fdm|resin|creality|scanner|accessories/.test(s))) return 'printer';
  if (slugs.some((s) => /3d-pen/.test(s))) return 'pen';
  if (slugs.some((s) => /petg|metallic-series|single-solid|petg-clear/.test(s))) return 'petg';
  if (slugs.some((s) => /abs|asa|hips/.test(s))) return 'abs';
  if (slugs.some((s) => /pla_cf|nylon|taulman|speciality|pctpe/.test(s))) return 'special';
  if (slugs.some((s) => /pla|rpla|matte/.test(s))) return 'pla';
  return 'other';
}

export const isFilament = (p: Product) => ['pla', 'petg', 'abs', 'special'].includes(material(p));
export const plainText = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
