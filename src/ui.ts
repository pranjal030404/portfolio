import { motionOn } from './motion/prefs';
import { themeSwap } from './motion/micro';

const WHATSAPP = '918400095088';

/* ─────────────────────────────────────────────────────── theme ── */

export function initTheme(): void {
  const button = document.getElementById('theme');
  const meta = document.querySelector('meta[name="theme-color"]');
  const stored = localStorage.getItem('theme');

  const apply = (theme: 'dark' | 'light') => {
    document.body.classList.toggle('light', theme === 'light');
    button?.setAttribute('aria-pressed', String(theme === 'light'));
    button?.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    meta?.setAttribute('content', theme === 'light' ? '#f2ede3' : '#16130f');
  };

  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  apply(stored === 'light' || (stored === null && prefersLight) ? 'light' : 'dark');

  button?.addEventListener('click', () => {
    const next = document.body.classList.contains('light') ? 'dark' : 'light';

    // the swap itself is unchanged — themeSwap only decides whether it is
    // wiped in or applied outright
    themeSwap(button as HTMLElement, () => apply(next));

    try { localStorage.setItem('theme', next); } catch { /* ignore */ }
  });
}

/* ──────────────────────────────────────────────────────── nav ── */

export function initNav(): void {
  const button = document.getElementById('menu');
  const nav = document.getElementById('nav');
  if (!button || !nav) return;

  const close = () => {
    nav.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open menu');
  };

  button.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
}

export function initScrollSpy(): void {
  if (!('IntersectionObserver' in window)) return;

  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav a[href^="#"]'));
  const sections = links
    .map(link => document.getElementById(link.getAttribute('href')!.slice(1)))
    .filter((section): section is HTMLElement => Boolean(section));

  const spy = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link =>
          link.classList.toggle('on', link.getAttribute('href') === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  sections.forEach(section => spy.observe(section));
}

/* ───────────────────────────────────────────── scroll progress ── */

/**
 * Reports read position. Left on under reduced-motion because it conveys
 * information rather than decoration — it moves only when the user scrolls.
 */
export function initScrollProgress(): void {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  let frame = 0;

  const update = () => {
    frame = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.transform = `scaleX(${progress.toFixed(4)})`;
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
}

/* ────────────────────────────────────────────────────── reveal ── */

/**
 * The hidden state is added by script, never in the markup — with JavaScript
 * off, every section renders normally instead of sitting at opacity 0.
 */
/**
 * Each group names the variant it arrives with, so a heading rises, a margin
 * note comes in from the side and a card scales up — rather than the whole
 * page doing the same eight-pixel fade forty times over.
 */
const REVEALS: Array<[selector: string, variant: string]> = [
  ['.system-head, .contact-statement, .gallery-head', 'rv'],
  ['.about-top > *, .code-col, .group, .degree, .schooling', 'rv'],
  ['.flow li .step', 'rv-left'],
  ['.flow li .note', 'rv-right'],
  ['.record, .case', 'rv'],
  ['.mid, .shot', 'rv-scale'],
  ['.minor li, .lab-row, .now > div', 'rv'],
  ['.contact-grid > *', 'rv-blur'],
  ['.term, .snippet', 'rv-scale']
];

export function initReveal(): void {
  if (!motionOn() || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -4% 0px' }
  );

  REVEALS.forEach(([selector, variant]) => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(selector))
      // anything already on screen is left alone — the hidden state is added
      // by script, and hiding what the visitor can already see is a flash
      .filter(el => el.getBoundingClientRect().top > window.innerHeight * 0.9);

    targets.forEach((el, i) => {
      el.classList.add(variant);
      // groups that arrive together arrive one after another
      el.style.setProperty('--i', String(i % 6));
      observer.observe(el);
    });
  });
}

/* ───────────────────────────────────────────────────── contact ── */

/**
 * Without script the form GETs to wa.me with its `text` field, which already
 * works. With script we compose a fuller message first.
 */
export function initMessageForm(): void {
  const form = document.getElementById('message-form') as HTMLFormElement | null;
  const status = document.getElementById('message-status');
  if (!form) return;

  form.addEventListener('submit', event => {
    if (!form.checkValidity()) return;
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const body = String(data.get('text') ?? '').trim();

    const text = [
      name ? `Hi Pranjal, I'm ${name}.` : 'Hi Pranjal.',
      email ? `Email: ${email}` : '',
      body
    ].filter(Boolean).join('\n');

    window.open(
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );

    if (status) {
      status.textContent = 'Opening WhatsApp…';
      window.setTimeout(() => { status.textContent = ''; }, 4000);
    }

    form.reset();
  });
}
