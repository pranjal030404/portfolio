const WHATSAPP = '918400095088';

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    apply(next);
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

/* ────────────────────────────────────────────────────── reveal ── */

/**
 * The hidden state is added by script, never in the markup — with JavaScript
 * off, every section renders normally instead of sitting at opacity 0.
 */
export function initReveal(): void {
  if (reduceMotion() || !('IntersectionObserver' in window)) return;

  const targets = Array.from(
    document.querySelectorAll<HTMLElement>(
      '.system-head, .flow li, .about-top > *, .now > div, .record, .case, .mid, .minor li, .group, .lab-list > li, .contact-statement, .contact-grid > *, .edu'
    )
  ).filter(el => el.getBoundingClientRect().top > window.innerHeight * 0.9);

  if (!targets.length) return;

  targets.forEach(el => el.classList.add('rv'));

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

  targets.forEach(el => observer.observe(el));
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
