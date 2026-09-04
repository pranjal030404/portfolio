import { motionOn } from './prefs';

/**
 * The small ones: copy-to-clipboard, the project sheet that expands out of a
 * gallery card, the tick on a sent message, and the circular wipe on the
 * theme swap.
 */

/* ───────────────────────────────────────────────────────────── copy ── */

/**
 * Adds a copy button beside anything marked data-copy. The button is built
 * here rather than in the markup because with script off there is nothing
 * for it to do, and a dead button is worse than no button.
 */
export function initCopy(): void {
  document.querySelectorAll<HTMLElement>('[data-copy]').forEach(host => {
    const value = host.dataset.copy || host.textContent?.trim() || '';
    if (!value || !navigator.clipboard) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy';
    button.setAttribute('aria-label', `Copy ${value}`);
    button.dataset.tip = 'Copy';

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        return;                                  // denied, or no permission
      }

      button.classList.add('done');
      button.dataset.tip = 'Copied';
      button.setAttribute('aria-label', `Copied ${value}`);

      window.setTimeout(() => {
        button.classList.remove('done');
        button.dataset.tip = 'Copy';
        button.setAttribute('aria-label', `Copy ${value}`);
      }, 1800);
    });

    host.after(button);
  });
}

/* ──────────────────────────────────────────────── screenshot fade-in ── */

/**
 * Real screenshots fade in once decoded rather than popping in abruptly
 * mid-scroll (lazy-loaded cards) or mid-open (the sheet's cloned image).
 */
function fadeInImage(img: HTMLImageElement): void {
  if (img.complete && img.naturalWidth > 0) {
    img.classList.add('is-loaded');
    return;
  }
  img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
}

export function initImageFade(): void {
  document.querySelectorAll<HTMLImageElement>('.case-figure img, .shot-visual img').forEach(fadeInImage);
}

/* ──────────────────────────────────────────────────── project sheet ── */

/**
 * Expands a gallery card into a panel over the page. Everything the panel
 * shows already exists on the card, so this reads the card rather than
 * carrying a second copy of the content.
 */
export function initSheet(): void {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.shot[data-open]'));
  if (!cards.length) return;

  const sheet = document.createElement('div');
  sheet.className = 'sheet';
  sheet.innerHTML = `
    <div class="sheet-card" role="dialog" aria-modal="true" aria-labelledby="sheet-title" tabindex="-1">
      <h3 id="sheet-title"></h3>
      <p class="sheet-meta"></p>
      <div class="sheet-visual" aria-hidden="true"></div>
      <p class="sheet-text"></p>
      <div class="sheet-foot">
        <a class="sheet-go" target="_blank" rel="noopener noreferrer"></a>
        <button class="sheet-close" type="button">Close <span aria-hidden="true">×</span></button>
      </div>
    </div>`;
  document.body.append(sheet);

  const card = sheet.querySelector<HTMLElement>('.sheet-card')!;
  const title = sheet.querySelector<HTMLElement>('#sheet-title')!;
  const meta = sheet.querySelector<HTMLElement>('.sheet-meta')!;
  const visual = sheet.querySelector<HTMLElement>('.sheet-visual')!;
  const text = sheet.querySelector<HTMLElement>('.sheet-text')!;
  const go = sheet.querySelector<HTMLAnchorElement>('.sheet-go')!;
  const closeButton = sheet.querySelector<HTMLButtonElement>('.sheet-close')!;

  let opener: HTMLElement | null = null;

  const close = () => {
    sheet.classList.remove('open');
    document.body.style.removeProperty('overflow');
    opener?.focus();
    opener = null;
  };

  const open = (shot: HTMLElement) => {
    opener = shot;

    title.textContent = shot.querySelector('h3')?.textContent ?? '';
    meta.textContent = [
      shot.querySelector('.shot-body p:not(.shot-tech):not(.shot-open)')?.textContent,
      shot.querySelector('.shot-tech')?.textContent
    ].filter(Boolean).join('  ·  ');
    text.textContent = shot.dataset.text ?? '';

    // real screenshot on the card wins; without one the panel falls back
    // to the same drawn pattern the card itself shows
    const cardImg = shot.querySelector<HTMLImageElement>('.shot-visual img');
    visual.innerHTML = '';
    visual.classList.toggle('has-img', !!cardImg);
    if (cardImg) {
      const img = document.createElement('img');
      img.decoding = 'async';
      img.src = cardImg.src;
      img.alt = '';
      visual.append(img);
      fadeInImage(img);
    }

    const href = shot.dataset.href ?? '';
    go.href = href;
    go.textContent = `${shot.dataset.label ?? 'Open'} →`;
    go.hidden = !href;

    sheet.classList.add('open');
    document.body.style.overflow = 'hidden';
    card.focus();
  };

  cards.forEach(shot => {
    shot.tabIndex = 0;
    shot.setAttribute('role', 'button');
    shot.dataset.cursor = 'Open';

    shot.addEventListener('click', event => {
      // a real link inside the card wins
      if ((event.target as Element | null)?.closest('a')) return;
      open(shot);
    });

    shot.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      open(shot);
    });
  });

  closeButton.addEventListener('click', close);
  sheet.addEventListener('click', event => { if (event.target === sheet) close(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && sheet.classList.contains('open')) close();
  });
}

/* ─────────────────────────────────────────────────── message tick ── */

/** Draws a checkmark next to the confirmation the contact form writes. */
export function initSendTick(): void {
  const status = document.getElementById('message-status');
  if (!status) return;

  const tick = `<svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5 9.5 18 20 6.5"/></svg>`;

  new MutationObserver(() => {
    const said = status.textContent?.trim();

    if (!said) { status.classList.remove('sent'); return; }
    if (status.querySelector('.tick')) return;

    status.innerHTML = tick + said;
    status.classList.add('sent');
  }).observe(status, { childList: true, characterData: true, subtree: true });
}

/* ────────────────────────────────────────────── theme transition ── */

type Doc = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

/**
 * Wipes a theme change in as a circle spreading out of the control that
 * caused it. Uses the View Transitions API where it exists; everywhere else
 * `swap` runs on its own and the theme changes instantly, which is what it
 * did before this file existed.
 */
export function themeSwap(origin: HTMLElement | null, swap: () => void): void {
  const doc = document as Doc;

  if (!motionOn() || typeof doc.startViewTransition !== 'function') {
    swap();
    return;
  }

  const box = origin?.getBoundingClientRect();
  const root = document.documentElement;
  root.style.setProperty('--tx', box ? `${box.left + box.width / 2}px` : '50%');
  root.style.setProperty('--ty', box ? `${box.top + box.height / 2}px` : '50%');

  document.body.classList.add('theme-swap');

  doc.startViewTransition(swap).finished
    .catch(() => { /* interrupted by a second click */ })
    .finally(() => document.body.classList.remove('theme-swap'));
}
