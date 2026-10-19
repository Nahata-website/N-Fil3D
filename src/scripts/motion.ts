// Site-wide motion with GSAP: split-text headings, hero intro, scroll reveals, colour wall, parallax.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'expo.out';
const START = 'top 88%';

function showAll() {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
}

if (reduce) {
  showAll();
} else {
  root.classList.add('gsap');
  const reveals = new Set(gsap.utils.toArray<HTMLElement>('.reveal'));
  gsap.set([...reveals], { autoAlpha: 0, y: 32, transition: 'none' });

  const hero = document.querySelector<HTMLElement>('.hero');

  document.fonts.ready.then(() => {
    // 1. Headings: words rise out of a line mask
    gsap.utils.toArray<HTMLElement>('main h1, main .h-1, main .h-2, main .h-display').forEach((h) => {
      if (h.closest('[hidden], .card, .faq')) return;
      reveals.delete(h);
      gsap.set(h, { autoAlpha: 1, y: 0, clearProps: 'transition' });
      const split = SplitText.create(h, { type: 'lines,words', mask: 'lines', linesClass: 'sl' });
      const inHero = hero?.contains(h);
      gsap.from(split.words, {
        yPercent: 115, duration: 1.2, ease: EASE, stagger: 0.045, delay: inHero ? 0.15 : 0,
        scrollTrigger: inHero ? undefined : { trigger: h, start: START, once: true },
      });
    });

    // 2. Eyebrows: characters type in
    gsap.utils.toArray<HTMLElement>('main .eyebrow').forEach((e) => {
      if (e.closest('[hidden], .card')) return;
      reveals.delete(e);
      gsap.set(e, { autoAlpha: 1, y: 0, clearProps: 'transition' });
      const split = SplitText.create(e, { type: 'chars' });
      const inHero = hero?.contains(e);
      gsap.from(split.chars, {
        autoAlpha: 0, duration: 0.05, stagger: 0.022, ease: 'none',
        scrollTrigger: inHero ? undefined : { trigger: e, start: START, once: true },
      });
    });

    // 3. Hero: image unmasks, readout counts up, CTA rises
    if (hero) {
      const vis = hero.querySelector<HTMLElement>('.hero-visual');
      const img = vis?.querySelector('img');
      const readout = vis?.querySelector<HTMLElement>('.readout');
      const val = readout?.querySelector<HTMLElement>('[data-count]');
      const copy = gsap.utils.toArray<HTMLElement>('.hero-copy > .reveal:not(h1):not(.eyebrow)', hero);
      [vis, ...copy].forEach((el) => el && reveals.delete(el));
      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.fromTo(copy, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.1, clearProps: 'transition,transform,translate' }, 0.5);
      if (vis) {
        gsap.set(vis, { autoAlpha: 1, y: 0 });
        tl.fromTo(vis, { clipPath: 'inset(12% 14% 12% 14% round 48px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.6, clearProps: 'clipPath' }, 0.1);
        if (img) gsap.set(img, { transition: 'none' });
        if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.9 }, 0.1);
        if (readout) tl.fromTo(readout, { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 1 }, 0.9);
        if (val) {
          const target = parseFloat(val.dataset.count || '0');
          const unit = val.querySelector('small')?.outerHTML || '';
          const o = { v: 0 };
          tl.to(o, { v: target, duration: 1.4, ease: 'power3.out', onUpdate: () => { val.innerHTML = o.v.toFixed(3) + unit; } }, 0.9);
        }
        if (img) gsap.to(img, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: vis, start: 'top top', end: 'bottom top', scrub: true } });
      }
    }

    // 4. Trust strip: items step in
    gsap.utils.toArray<HTMLElement>('.trust').forEach((t) => {
      reveals.delete(t);
      gsap.set(t, { autoAlpha: 1, y: 0 });
      gsap.from(t.children, { autoAlpha: 0, y: 24, duration: 1, ease: EASE, stagger: 0.08, scrollTrigger: { trigger: t, start: START, once: true } });
    });

    // 5. Colour wall: swatches pop in as shapes
    const wall = gsap.utils.toArray<HTMLElement>('.wall > li');
    if (wall.length) {
      wall.forEach((w) => reveals.delete(w));
      gsap.set(wall, { autoAlpha: 1, y: 0 });
      const dots = wall.map((w) => w.firstElementChild as HTMLElement);
      gsap.set(dots, { transition: 'none' });
      gsap.from(dots, {
        scale: 0, rotate: -45, duration: 0.9, ease: 'back.out(1.7)', clearProps: 'transform,rotate,scale,transition',
        stagger: { each: 0.02, grid: 'auto', from: 'start' },
        scrollTrigger: { trigger: '.wall', start: START, once: true },
      });
    }

    // 6. Everything else marked .reveal: staggered batches
    ScrollTrigger.batch([...reveals], {
      start: START, once: true,
      onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.07, overwrite: true, clearProps: 'transition,transform,translate' }),
    });

    // 7. Product grids revealed by tab switches get a fresh stagger
    document.querySelectorAll<HTMLElement>('[data-tab]').forEach((b) => b.addEventListener('click', () => {
      requestAnimationFrame(() => {
        const panel = document.getElementById(`tab-${b.dataset.tab}`);
        if (panel) gsap.fromTo(panel.children, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE, stagger: 0.05, overwrite: true });
        ScrollTrigger.refresh();
      });
    }));

    ScrollTrigger.refresh();
    let rt = 0;
    new ResizeObserver(() => { clearTimeout(rt); rt = window.setTimeout(() => ScrollTrigger.refresh(), 200); }).observe(document.body);

    // Safety net: never leave content hidden (e.g. short pages or zoomed layouts)
    const flush = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        gsap.to([...reveals].filter((el) => getComputedStyle(el).opacity === '0'), { autoAlpha: 1, y: 0, duration: 0.6, overwrite: true });
        ScrollTrigger.getAll().forEach((st) => st.animation && st.animation.progress() === 0 && st.animation.play());
      }
    };
    addEventListener('scroll', flush, { passive: true });
  });

  // Magnetic pull on large buttons (pointer devices only)
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll<HTMLElement>('.btn-lg').forEach((btn) => {
      const xTo = gsap.quickTo(btn, '--mx', { duration: 0.5, ease: 'power3.out', unit: 'px' } as gsap.QuickToVars);
      const yTo = gsap.quickTo(btn, '--my', { duration: 0.5, ease: 'power3.out', unit: 'px' } as gsap.QuickToVars);
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.25);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }
}
