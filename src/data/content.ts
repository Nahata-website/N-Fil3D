// Shared copy used across pages. Facts come from nfil3d.com.
export const FAQ: [string, string][] = [
 [
  "What is the difference between PLA, PETG and ABS filament?",
  "PLA is the easiest to print and best for models, prototypes and school projects. PETG is stronger and more heat-resistant, so it suits functional parts and containers. ABS is the toughest and most heat-resistant of the three, but it warps more and is best printed in an enclosed printer."
 ],
 [
  "Which filament should a beginner start with?",
  "Start with PLA+. It prints at low temperatures, rarely warps and does not need an enclosure. NFIL3D's high-speed PLA+ comes in solid, matte, metallic, clear and glow-in-the-dark colours."
 ],
 [
  "Will 1.75 mm filament work in my 3D printer?",
  "All NFIL3D 3D printer filament is 1.75 mm, the size used by most FDM printers sold in India, including Creality, Bambu Lab, Anycubic and NFIL3D printers. Check your printer's manual; a few older printers use 2.85 mm."
 ],
 [
  "What nozzle temperature should I use for NFIL3D filament?",
  "Recommended nozzle temperatures for each NFIL3D material and colour are on the Get Started page. The best value varies by printer, so print a temperature tower to fine-tune it."
 ],
 [
  "How should I store 3D printer filament?",
  "Keep filament dry. Store open spools in a sealed bag or box with desiccant. Every NFIL3D spool comes with desiccant that changes colour when it is saturated, and it can be dried and reused."
 ],
 [
  "What warranty does NFIL3D give?",
  "NFIL3D filament has a lifetime warranty against manufacturing defects; a confirmed defect is replaced free of charge. NFIL3D 3D printers have a 1-year warranty on parts and components. Register your warranty on the Register Your Warranty page."
 ],
 [
  "Does NFIL3D offer free shipping?",
  "Yes. Shipping is free on all orders within India."
 ],
 [
  "Can I buy filament in bulk?",
  "Yes. NFIL3D offers volume discounts on bulk orders. Call +91-80 80 80 1204 or email sales@nfil3d.com for a quote."
 ],
 [
  "What is the difference between an FDM and a resin 3D printer?",
  "An FDM printer melts filament and builds parts layer by layer; it suits prototypes, functional parts and large prints. A resin printer cures liquid resin with light and gives much finer detail, for miniatures, jewellery and dental models, but needs washing and curing after printing."
 ],
 [
  "Is PETG food safe?",
  "PETG as a material is widely used for food packaging, but a 3D printed part has small gaps between layers that can trap bacteria, and the nozzle can add contaminants. Do not rely on any 3D printed part for repeated food contact unless it is sealed with a food-safe coating."
 ],
 [
  "What is a 3D pen and what age is it for?",
  "A 3D pen melts 1.75 mm filament so you can draw in the air and build 3D shapes by hand. NFIL3D 3D pen kits are designed for kids and adults; younger children should use them with an adult, as the nozzle gets hot."
 ],
 [
  "Why are my prints not sticking to the bed?",
  "The most common causes are an unlevelled bed, a nozzle that is too far from the bed, or a dirty bed surface. Re-level the bed, clean it with isopropyl alcohol and slow down the first layer. The Support page has more troubleshooting steps."
 ],
 [
  "How can I contact NFIL3D support?",
  "Call +91-80 80 80 1204, email sales@nfil3d.com, or chat on WhatsApp, Monday to Saturday, 9:00 am to 5:30 pm."
 ]
];

// Rank Math-style titles/descriptions for core pages (keyed by old WordPress page id).
export const PAGE_META: Record<string, [string, string]> = {
 "216": [
  "3D Printers & Filament Online in India | NFIL3D",
  "Shop 3D printers, PLA, PETG and ABS filament, 3D pens and scanners from NFIL3D. Lifetime warranty on filament and free shipping across India."
 ],
 "8": [
  "Shop 3D Printers, Filament & 3D Pens | NFIL3D",
  "Browse every NFIL3D product in one place: FDM and resin 3D printers, 1.75 mm PLA, PETG and ABS filament, 3D pens, scanners and spares."
 ],
 "5673": [
  "NFIL3D Support: 3D Printer & Filament Help",
  "Setup guides, troubleshooting and warranty help for NFIL3D 3D printers and filament. Call, email or WhatsApp us, Monday to Saturday, 9 am to 5:30 pm."
 ],
 "4840": [
  "NFIL3D Warranty: Lifetime on Filament, 1 Year on Printers",
  "Register your NFIL3D warranty. Filament has a lifetime warranty against manufacturing defects and NFIL3D printers have a 1-year parts warranty."
 ],
 "5778": [
  "Get Started: NFIL3D Filament Settings & Setup Guide",
  "Recommended nozzle temperatures, data sheets and storage tips for NFIL3D PLA+, PETG, ABS and HIPS filament, plus how to use the filter and desiccant."
 ],
 "5640": [
  "The NFIL3D Story: 37+ Years in Engineering Plastics",
  "NFIL3D is backed by 37+ years in engineering plastic compounds and biopolymers, with a 4 lakh sq. ft. facility and an in-house filament testing lab."
 ],
 "7526": [
  "About NFIL3D: 3D Printing Solutions Brand from India",
  "NFIL3D makes and sells 3D printer filament, 3D printers, 3D pens and scanners, backed by 37+ years of plastics experience and an in-house testing lab."
 ],
 "7472": [
  "NFIL3D Blog: 3D Printing Guides & Buying Tips",
  "Guides to choosing a 3D printer and filament in India: printers for beginners and students, budget picks under Rs 25,000, and PLA vs ABS vs PETG."
 ],
 "1686": [
  "Contact NFIL3D: Sales & 3D Printing Support",
  "Contact NFIL3D for orders, bulk filament pricing and 3D printer support. Call +91-80 80 80 1204 or email sales@nfil3d.com, Monday to Saturday."
 ]
};

export type Mat = { key: string; name: string; href: string; from: string; use: string; ease: number; strength: number; heat: number; tags: string[] };
export const MATERIALS: Mat[] = [
  { key: 'pla', name: 'PLA+', href: '/product-category/3d-printer-filaments/pla/', from: '₹699', use: 'Easiest to print. Models, prototypes, school projects.', ease: 5, strength: 2, heat: 1, tags: ['beginner', 'looks'] },
  { key: 'matte', name: 'Matte PLA+', href: '/product-category/matte_pla/', from: '₹699', use: 'Soft, non-shiny finish that hides layer lines.', ease: 5, strength: 2, heat: 1, tags: ['beginner', 'looks'] },
  { key: 'tf', name: 'Turbo-Finish PLA+', href: '/product-category/3d-printer-filaments/pla_tf/', from: '₹719', use: 'Made for fast printers that need a clean surface.', ease: 5, strength: 2, heat: 1, tags: ['beginner'] },
  { key: 'petg', name: 'PETG', href: '/product-category/3d-printer-filaments/petg/', from: '₹899', use: 'Stronger and more heat-resistant. Brackets, containers.', ease: 4, strength: 3, heat: 3, tags: ['strong', 'outdoor'] },
  { key: 'abs', name: 'HI ABS+', href: '/product-category/3d-printer-filaments/abs-3d-printer-filaments/', from: '₹699', use: 'Tough and impact-resistant. Enclosures and tools.', ease: 2, strength: 4, heat: 4, tags: ['strong'] },
  { key: 'asa', name: 'ASA', href: '/product-category/3d-printer-filaments/asa-cat/', from: 'See range', use: 'Resists sun and weather. Outdoor parts.', ease: 2, strength: 4, heat: 4, tags: ['outdoor'] },
  { key: 'fr', name: 'ABS FR', href: '/product-category/3d-printer-filaments/abs-fr/', from: 'See range', use: 'Flame-retardant. Electrical housings.', ease: 2, strength: 4, heat: 4, tags: ['outdoor', 'eng'] },
  { key: 'cf', name: 'Carbon fibre PLA+', href: '/product-category/pla_cf/', from: '₹1,999', use: 'Stiff, matte-black parts. Needs a hardened nozzle.', ease: 3, strength: 4, heat: 2, tags: ['strong', 'eng'] },
  { key: 'nylon', name: 'Nylon', href: '/product-category/3d-printer-filaments/nylon-3d-printer-filaments/', from: 'See range', use: 'Strong and wear-resistant. Gears and hinges.', ease: 1, strength: 5, heat: 4, tags: ['eng'] },
  { key: 'metal', name: 'Metallic PLA+', href: '/product-category/3d-printer-filaments/pla/premium-pla-metallic-range/', from: '₹949', use: 'Silver, gold, copper and bronze sheen.', ease: 5, strength: 2, heat: 1, tags: ['looks'] },
  { key: 'glow', name: 'Glow PLA+', href: '/product-category/3d-printer-filaments/pla/premium-pla-glow-in-the-dark-range/', from: '₹949', use: 'Glows after light exposure. Toys, night lights.', ease: 5, strength: 2, heat: 1, tags: ['looks'] },
];
export const GOALS = [
  { key: 'beginner', label: 'First prints' },
  { key: 'strong', label: 'Strong parts' },
  { key: 'outdoor', label: 'Outdoor & heat' },
  { key: 'looks', label: 'Display & decor' },
  { key: 'eng', label: 'Engineering' },
];
