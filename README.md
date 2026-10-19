# NFIL3D website

The new nfil3d.com: a fast static site built with [Astro](https://astro.build). It has light and dark themes and is set up for SEO, AEO and GEO. Products, prices and categories come from the existing WooCommerce store. Cart, checkout and payments stay on WooCommerce.

- 212 pages: home, shop, 44 categories, 149 products, printers, materials, bulk/B2B, FAQ, Get Started, warranty, support, about, our story, contact, blog and 5 posts, 404
- Same product, category and blog URLs as the WordPress site, so Google rankings carry over. Changed URLs are redirected in `public/.htaccess`.
- Structured data: Organization, WebSite and SearchAction, Product (with brand, offer and free shipping), BreadcrumbList, FAQPage, HowTo, BlogPosting, CollectionPage
- `sitemap-index.xml`, `robots.txt` (AI crawlers allowed) and `llms.txt`
- Light/dark theme: follows the system setting, has a toggle, and doesn't flash on load
- Motion with GSAP (`src/scripts/motion.ts`): split-text headings, hero intro with diameter count-up, scroll reveals, colour wall, parallax, magnetic buttons. Turns off for "reduce motion" users.
- Interactions: filament finder, bestseller tabs, image zoom, live product search, filters and sort

## Run it locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs the site to dist/
npm run preview    # serves dist/
```

## Update products and prices

```bash
npm run sync       # pulls products, categories and blog posts from WooCommerce into src/data/
npm run build
```

Run this whenever prices, stock or products change in WordPress, then deploy again. SEO titles and descriptions live in `src/data/seo.json` and survive every sync.

## Settings to check before launch

All in `src/config/site.ts`:

| Setting | What it does |
|---|---|
| `storeUrl` | Where WooCommerce lives (cart, checkout, account). See "Going live" below. |
| `madeInIndia` | Leave `false` until NFIL3D confirms. |
| `dispatch` | Dispatch time shown on product pages, e.g. `'1–2 working days'`. |
| `showQubeTeaser` | Big Qube / Mega Qube teaser on the home page. |

Also check:

- `public/contact.php`: the inbox that receives form emails (`$TO`, `$FROM`).
- `src/pages/brand-story.astro`: add the founding year and facility location once confirmed.

## Going live on Hostinger

The new site replaces WordPress at `nfil3d.com`. WooCommerce has to keep running for cart and checkout, so WordPress moves to a subdomain.

1. **Back up** WordPress in hPanel → Backups.
2. **Create a subdomain** `shop.nfil3d.com` in hPanel → Domains → Subdomains.
3. **Move WordPress to the subdomain:** in hPanel go to WordPress → Tools → Change domain (or use Hostinger's migration), and set the site URL to `https://shop.nfil3d.com`.
4. **Point the new site at the store:** in `src/config/site.ts`, set `storeUrl: 'https://shop.nfil3d.com'`. In `public/.htaccess`, uncomment the two store redirect lines.
5. **Build and upload:** run `npm run build`, then upload everything inside `dist/` (including `.htaccess`) to `public_html/` for `nfil3d.com`. Use File Manager, FTP, or the GitHub Action below.
6. **Check:** open the home page, a product, add to cart (it should land on `shop.nfil3d.com/cart/`), the contact form and `/sitemap-index.xml`.
7. **Google Search Console:** submit `https://nfil3d.com/sitemap-index.xml` and request indexing for the home page.
8. **Keep WordPress out of search:** in Rank Math on `shop.nfil3d.com`, set the store's product and category pages to noindex, or add canonicals pointing to nfil3d.com. This stops the two sites competing.

## Auto-deploy from GitHub

`.github/workflows/deploy.yml` builds the site and uploads `dist/` to Hostinger over FTP on every push to `main`.

In GitHub, go to repo → Settings → Secrets and variables → Actions, and add:

- `FTP_SERVER`: from hPanel → Files → FTP Accounts, e.g. `ftp.nfil3d.com`
- `FTP_USERNAME`
- `FTP_PASSWORD`

## Folder map

```
src/config/site.ts     contact details, store URL, launch switches
src/data/              products, categories, posts (synced) + seo.json + shared copy
src/lib/data.ts        data helpers (categories, colours, product families)
src/layouts/Base.astro <head>, SEO tags, JSON-LD, theme, header/footer
src/components/        header, footer, product card, catalogue, finder, FAQ
src/pages/             every page and the product/category/blog generators
public/                images, .htaccess, robots.txt, llms.txt, contact.php
scripts/sync-woo.mjs   WooCommerce → JSON sync
```

## Deploy on Cloudflare Pages

1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick `Nahata-website/N-Fil3D`.
2. Framework preset: **Astro**. Build command: `npm run build`. Output directory: `dist`.
3. Environment variable: `NODE_VERSION` = `20`.
4. Save and Deploy. You get a `*.pages.dev` preview link; add `nfil3d.com` under Custom domains only at go-live.

`public/_redirects` and `public/_headers` do the job of `.htaccess` on Cloudflare. `contact.php` does not run on Cloudflare (no PHP), so the forms need a form service before launch.
