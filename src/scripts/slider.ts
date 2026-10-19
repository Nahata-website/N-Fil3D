// Home banner slider: auto-advances every 6.5 s, each slide has its own GSAP intro and idle motion.
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const root = document.querySelector<HTMLElement>('[data-slider]');
const ui = document.querySelector<HTMLElement>('[data-slider-ui]');

if (root && ui) {
  const slides = gsap.utils.toArray<HTMLElement>('[data-slide]', root);
  const dots = gsap.utils.toArray<HTMLButtonElement>('[data-go]', ui);
  const pauseBtn = ui.querySelector<HTMLButtonElement>('[data-pause]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const DURATION = 6.5;
  const EASE = 'expo.out';
  let current = 0;
  let paused = false;
  let hovering = false;
  const splits = new Map<HTMLElement, SplitText>();

  // Move CSS tilts into GSAP so later tweens keep them
  root.querySelectorAll<HTMLElement>('.s-card, .s-pen').forEach((el) => {
    const r = parseFloat(getComputedStyle(el).rotate) || 0;
    el.style.rotate = 'none';
    gsap.set(el, { rotation: r });
  });

  // Doodles: prepare stroke drawing
  root.querySelectorAll<SVGPathElement>('.doodle path').forEach((p) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`;
    p.style.strokeDashoffset = '0';
    p.dataset.len = String(len);
  });

  function intro(i: number) {
    const s = slides[i];
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    if (i === 0) {
      tl.fromTo(s.querySelectorAll('.hero-copy > *'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0);
      tl.fromTo(s.querySelectorAll('.spool, .readout'), { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.1);
      return tl;
    }
    const title = s.querySelector<HTMLElement>('.s-title');
    if (title) {
      if (!splits.has(title)) splits.set(title, SplitText.create(title, { type: 'lines,words', mask: 'lines' }));
      tl.fromTo(splits.get(title)!.words, { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: 0.05 }, 0.05);
    }
    tl.fromTo(s.querySelectorAll('.s-eyebrow, .s-sub, .s-cta'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.2);
    const shapes = s.querySelectorAll<HTMLElement>('.s-shape');
    shapes.forEach((sh) => {
      if (sh.classList.contains('arc')) tl.fromTo(sh, { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 1.2 }, 0);
      else if (sh.classList.contains('panel')) tl.fromTo(sh, { scaleX: 0, transformOrigin: '100% 50%' }, { scaleX: 1, duration: 1.2 }, 0);
      else if (sh.classList.contains('sun')) tl.fromTo(sh, { scale: 0.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.3 }, 0);
      else if (sh.classList.contains('gem')) tl.fromTo(sh, { autoAlpha: 0, y: 40, rotate: -30 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 1.1, ease: 'back.out(1.6)' }, 0.7);
      else tl.fromTo(sh, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.9 }, 0.3);
    });
    tl.fromTo(s.querySelectorAll('.s-card'), { autoAlpha: 0, y: 80 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.09 }, 0.25);
    const pen = s.querySelector<HTMLElement>('.s-pen');
    if (pen) tl.fromTo(pen, { autoAlpha: 0, x: 160, y: -60 }, { autoAlpha: 1, x: 0, y: 0, duration: 1.3 }, 0.45);
    // doodles draw themselves, as if traced by the pen
    s.querySelectorAll<SVGPathElement>('.doodle path').forEach((p, k) => {
      const len = Number(p.dataset.len || 0);
      tl.fromTo(p, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 0.8 + k * 0.06);
    });
    return tl;
  }

  // Idle motion: pens bob and drift, doodles breathe
  if (!reduce) {
    root.querySelectorAll<HTMLElement>('.s-pen').forEach((pen, k) => {
      gsap.to(pen, { y: k ? -14 : -8, rotation: k ? '+=4' : '-=3', duration: 2.4 + k * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
    root.querySelectorAll<HTMLElement>('.gem').forEach((g) => gsap.to(g, { y: -10, rotation: 6, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    root.querySelectorAll<SVGElement>('.butterfly').forEach((b) => gsap.to(b, { y: -8, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
  }

  // Hover: filament spools give a subtle wobble; pens lean in
  root.querySelectorAll<HTMLElement>('.s-spool, .spool').forEach((el) => {
    el.addEventListener('pointerenter', () => {
      if (reduce || el.dataset.wob) return;
      el.dataset.wob = '1';
      gsap.to(el, { keyframes: [{ rotation: '+=4', duration: 0.12 }, { rotation: '-=8', duration: 0.2 }, { rotation: '+=6', duration: 0.18 }, { rotation: '-=2', duration: 0.14 }], ease: 'sine.inOut', overwrite: false, onComplete: () => { delete el.dataset.wob; } });
    });
  });
  if (fine && !reduce) {
    root.querySelectorAll<HTMLElement>('.s-stage').forEach((stage) => {
      const cards = gsap.utils.toArray<HTMLElement>('.s-card, .s-pen, .gem', stage);
      const movers = cards.map((c, k) => ({ x: gsap.quickTo(c, 'x', { duration: 0.9, ease: 'power3.out' }), d: c.classList.contains('s-pen') ? 28 : 8 + (k % 3) * 6 }));
      stage.addEventListener('pointermove', (e) => {
        const r = stage.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        movers.forEach((m) => m.x(nx * m.d));
      });
      stage.addEventListener('pointerleave', () => movers.forEach((m) => m.x(0)));
    });
  }

  // Progress + autoplay
  const progress = { p: 0 };
  let ticker: gsap.core.Tween | null = null;
  function setDot(i: number) {
    dots.forEach((d, k) => { d.setAttribute('aria-selected', String(k === i)); d.style.setProperty('--p', k === i ? '0' : '0'); });
  }
  function startTimer() {
    ticker?.kill();
    progress.p = 0;
    const dot = dots[current];
    if (reduce) { dot.style.setProperty('--p', '1'); return; }
    ticker = gsap.to(progress, { p: 1, duration: DURATION, ease: 'none', onUpdate: () => dot.style.setProperty('--p', String(progress.p)), onComplete: () => go((current + 1) % slides.length) });
    if (paused || hovering || document.hidden) ticker.pause();
  }

  function go(i: number) {
    if (i === current) return;
    const out = slides[current];
    const inn = slides[i];
    out.classList.remove('is-active');
    out.setAttribute('aria-hidden', 'true');
    out.inert = true;
    inn.classList.add('is-active');
    inn.removeAttribute('aria-hidden');
    inn.inert = false;
    if (reduce) {
      gsap.set(out, { autoAlpha: 0 });
      gsap.set(inn, { autoAlpha: 1 });
    } else {
      gsap.to(out, { autoAlpha: 0, y: -20, duration: 0.5, ease: 'power2.in', onComplete: () => { gsap.set(out, { y: 0 }); } });
      gsap.fromTo(inn, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, delay: 0.25 });
      gsap.delayedCall(0.25, () => intro(i));
    }
    current = i;
    setDot(i);
    startTimer();
  }

  dots.forEach((d, k) => d.addEventListener('click', () => go(k)));
  pauseBtn?.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.setAttribute('aria-pressed', String(paused));
    pauseBtn.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
    if (paused) ticker?.pause(); else if (!hovering) ticker?.resume();
  });
  const hero = root.closest('.hero') || root;
  hero.addEventListener('focusin', () => { hovering = true; ticker?.pause(); });
  hero.addEventListener('focusout', () => { hovering = false; if (!paused) ticker?.resume(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) ticker?.pause(); else if (!paused && !hovering) ticker?.resume(); });

  // Swipe on touch screens
  let x0: number | null = null;
  root.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) go((current + (dx < 0 ? 1 : slides.length - 1)) % slides.length);
    x0 = null;
  });

  slides.forEach((s, k) => gsap.set(s, { autoAlpha: k ? 0 : 1 }));
  setDot(0);
  startTimer();
}
