import { motionOn } from './prefs';
import { onScroll } from './frame';

/**
 * Masthead behaviour: it shrinks once you are past the hero, gets out of the
 * way when you scroll down and comes back the moment you scroll up, and
 * carries a single indicator that slides between nav items instead of nine
 * separate underlines growing and shrinking.
 */

/* ─────────────────────────────────────────────── shrink and hide ── */

export function initMasthead(): void {
  const masthead = document.querySelector<HTMLElement>('.masthead');
  if (!masthead) return;

  let last = window.scrollY;

  onScroll(y => {
    masthead.classList.toggle('shrink', y > 80);

    // never hide while the mobile menu is open, or at the very top
    const menuOpen = document.getElementById('nav')?.classList.contains('open');
    const down = y > last && y > 240;

    masthead.classList.toggle('hide', Boolean(down && !menuOpen && motionOn()));
    last = y;
  });
}

/* ──────────────────────────────────────────────── nav indicator ── */

export function initNavIndicator(): void {
  const nav = document.getElementById('nav');
  const list = nav?.querySelector('ul');
  if (!nav || !list) return;

  const indicator = document.createElement('span');
  indicator.className = 'nav-ind';
  indicator.setAttribute('aria-hidden', 'true');
  list.append(indicator);

  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a'));

  const moveTo = (link: HTMLAnchorElement | null) => {
    // the stacked mobile menu has no row for it to travel along
    if (!link || window.innerWidth <= 900 || !motionOn()) {
      indicator.classList.remove('on');
      return;
    }

    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    indicator.classList.add('on');
  };

  const current = () => links.find(link => link.classList.contains('on')) ?? null;

  links.forEach(link => {
    link.addEventListener('pointerenter', () => moveTo(link));
    link.addEventListener('focus', () => moveTo(link));
  });

  nav.addEventListener('pointerleave', () => moveTo(current()));

  // The scroll spy in ui.ts owns the .on class; follow whatever it decides.
  // moveTo puts .on on the indicator, which lives inside the list — without
  // the guard that mutation re-enters this callback forever.
  new MutationObserver(records => {
    if (records.every(record => record.target === indicator)) return;
    if (!nav.matches(':hover')) moveTo(current());
  }).observe(list, { subtree: true, attributes: true, attributeFilter: ['class'] });

  window.addEventListener('resize', () => moveTo(current()), { passive: true });

  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  fonts?.ready?.then(() => moveTo(current())).catch(() => { /* ignore */ });

  moveTo(current());
}

/* ────────────────────────────────────────────── menu item stagger ── */

export function initMenuStagger(): void {
  document.querySelectorAll('#nav li').forEach((item, i) => {
    (item as HTMLElement).style.setProperty('--i', String(i));
  });
}

/* ───────────────────────────────────────────── section transition ── */

/**
 * Jumping between sections from the masthead plays a wipe, and the scroll
 * happens behind it. Only the masthead links do this — a wipe on every
 * in-content link would be theatre, and on a one-page site the nav is the
 * closest thing there is to changing page.
 */
export function initJump(): void {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const jump = document.createElement('div');
  jump.className = 'jump';
  jump.setAttribute('aria-hidden', 'true');
  document.body.append(jump);

  nav.addEventListener('click', event => {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link || !motionOn()) return;

    const id = link.getAttribute('href')?.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    event.preventDefault();

    jump.classList.remove('cover');
    void jump.offsetWidth;              // restart the animation
    jump.classList.add('cover');

    // land the scroll while the wipe covers the page
    window.setTimeout(() => {
      const top = target.getBoundingClientRect().top + window.scrollY -
        (document.querySelector('.masthead')?.clientHeight ?? 56) - 16;

      window.scrollTo({ top, behavior: 'auto' });

      // and leave focus where a visitor tabbing on would expect it
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }, 300);

    jump.addEventListener('animationend', () => jump.classList.remove('cover'), { once: true });
  });
}
