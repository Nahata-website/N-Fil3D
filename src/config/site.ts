// One place for everything NFIL3D may need to change.
// Items marked CONFIRM must be checked by NFIL3D before launch.

export const SITE = {
  name: 'NFIL3D',
  url: 'https://nfil3d.com',
  // Where WooCommerce (cart, checkout, account) lives. If the new site replaces
  // nfil3d.com, move WordPress to a subdomain such as https://shop.nfil3d.com and set it here.
  storeUrl: 'https://nfil3d.com',
  // Where WordPress product/blog images are served from. Set to 'https://shop.nfil3d.com' when WordPress moves.
  mediaUrl: 'https://nfil3d.com',
  // Web3Forms access key (free at web3forms.com). Empty = forms open the visitor's email app instead.
  formKey: '',
  phone: '+91-80 80 80 1204',
  phoneHref: 'tel:+918080801204',
  whatsapp: 'https://wa.me/918080801204',
  email: 'sales@nfil3d.com',
  hours: 'Monday to Saturday, 9:00 am – 5:30 pm',
  social: {
    instagram: 'https://www.instagram.com/nfil3d/',
    youtube: 'https://www.youtube.com/@n-fil3d60',
    facebook: 'https://www.facebook.com/Nfil3D/',
    amazon: 'https://www.amazon.in/stores/Nfil3d/page/35FCADD9-3C0E-4F8F-9A4E-2D010D9E61A0',
  },
  facts: {
    years: '37+',
    facility: '4 lakh sq. ft.',
    tolerance: '±0.015 mm',
    filamentWarranty: 'Lifetime warranty against manufacturing defects',
    printerWarranty: '1-year warranty on parts',
  },
  // CONFIRM: set to true only if NFIL3D confirms its filament is made in India.
  madeInIndia: false,
  // CONFIRM: dispatch time shown on product pages, e.g. '1–2 working days'. Empty hides it.
  dispatch: '',
  // Big Qube / Mega Qube teaser on the home page. Set false to hide until launch.
  showQubeTeaser: false,
};

export const cartUrl = (id: number, qty = 1) => `${SITE.storeUrl}/cart/?add-to-cart=${id}&quantity=${qty}`;
export const storePath = (p: string) => `${SITE.storeUrl}${p}`;
