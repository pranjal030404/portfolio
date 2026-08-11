import { motionOn } from './prefs';

/**
 * Text animation: splitting, the typewriter, and counters.
 *
 * The splitter walks text nodes rather than reading innerHTML, so the <em>
 * inside the hero statement — and any link inside a heading — survives the
 * operation intact. It also leaves the element's text content unchanged for
 * a screen reader: only presentational wrappers are inserted, and the words
 * remain words.
 */

/* ────────────────────────────────────────────────────── splitting ── */

type SplitMode = 'word' | 'char';

const wrapWords = (text: string, index: { n: number }): DocumentFragment => {
  const out = document.createDocumentFragment();

  // keep the spaces: splitting on them and re-adding loses the run-ins
  text.split(/(\s+)/).forEach(part => {
    if (!part) return;

    if (/^\s+$/.test(part)) {
      out.append(document.createTextNode(part));
      return;
    }

    const word = document.createElement('span');
    word.className = 'w';
    word.style.setProperty('--i', String(index.n));
    index.n += 1;

    const inner = document.createElement('i');
    inner.textContent = part;
    word.append(inner);
    out.append(word);
  });

  return out;
};

const wrapChars = (text: string, index: { n: number }): DocumentFragment => {
  const out = document.createDocumentFragment();

  Array.from(text).forEach(character => {
    if (character === ' ') {
      out.append(document.createTextNode(' '));
      return;
    }

    const span = document.createElement('span');
    span.className = 'ch';
    span.style.setProperty('--i', String(index.n));
    span.textContent = character;
    index.n += 1;
    out.append(span);
  });

  return out;
};

const walk = (node: Node, mode: SplitMode, index: { n: number }): void => {
  Array.from(node.childNodes).forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? '';
      if (!text.trim()) return;
      child.replaceWith(mode === 'word' ? wrapWords(text, index) : wrapChars(text, index));
      return;
    }

    if (child.nodeType === Node.ELEMENT_NODE) walk(child, mode, index);
  });
};

/**
 * Wraps every word (or character) of `el` for staggered animation.
 * Returns false when nothing was done, so callers can leave the element alone.
 */
export function split(el: HTMLElement, mode: SplitMode = 'word', lead = 0): boolean {
  // data-split names the mode and is set in the markup; data-splitDone is
  // the marker this function owns, so the two never collide
  if (!motionOn() || el.dataset.splitDone) return false;

  const index = { n: 0 };
  walk(el, mode, index);
  if (!index.n) return false;

  el.dataset.splitDone = 'yes';
  el.classList.add(mode === 'word' ? 'split' : 'split-ch');
  if (lead) el.style.setProperty('--lead', `${lead}ms`);

  return true;
}

/** Splits, then plays as soon as the element is on screen. */
export function splitOnView(el: HTMLElement, mode: SplitMode = 'word', lead = 0): void {
  if (!split(el, mode, lead)) return;

  const go = () => el.classList.add('go');

  if (!('IntersectionObserver' in window)) { go(); return; }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      go();
      observer.disconnect();
    });
  }, { threshold: 0.2 });

  observer.observe(el);
}

/* ───────────────────────────────────────────────────── typewriter ── */

/**
 * Types a phrase, holds it, deletes it, moves on. Nothing here loops on a
 * frame — it is a chain of timeouts, so an idle tab costs nothing.
 */
export function initTypewriter(): void {
  const host = document.getElementById('typewriter');
  if (!host) return;

  const phrases = (host.dataset.phrases ?? '').split('|').map(p => p.trim()).filter(Boolean);
  if (!phrases.length) return;

  if (!motionOn()) {
    host.textContent = phrases[0];
    document.querySelector('.caret')?.remove();
    return;
  }

  let phrase = 0;
  let cut = 0;
  let deleting = false;
  let timer = 0;

  const tick = () => {
    const full = phrases[phrase];
    cut += deleting ? -1 : 1;
    host.textContent = full.slice(0, cut);

    let wait = deleting ? 34 : 62;

    if (!deleting && cut === full.length) {
      wait = 1900;
      deleting = true;
    } else if (deleting && cut === 0) {
      deleting = false;
      phrase = (phrase + 1) % phrases.length;
      wait = 340;
    }

    timer = window.setTimeout(tick, wait);
  };

  timer = window.setTimeout(tick, 900);

  // a hidden tab should not queue up a hundred pending frames
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.clearTimeout(timer);
    else timer = window.setTimeout(tick, 400);
  });
}

/* ───────────────────────────────────────────────────────── counters ── */

/**
 * Counts a number up when it first comes into view. The element carries its
 * own final value in data-count, so with script off the markup already shows
 * the right figure.
 */
export function initCounters(): void {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
  if (!targets.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target as HTMLElement;
      observer.unobserve(el);

      const end = Number(el.dataset.count);
      if (!Number.isFinite(end)) return;

      if (!motionOn()) { el.textContent = el.dataset.countText ?? String(end); return; }

      const places = (el.dataset.count ?? '').split('.')[1]?.length ?? 0;
      const started = performance.now();
      const span = 1100;

      const step = (now: number) => {
        const t = Math.min(1, (now - started) / span);
        // ease-out cubic — fast at the start, arrives without a bump
        const value = end * (1 - Math.pow(1 - t, 3));
        el.textContent = value.toFixed(places);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = el.dataset.countText ?? end.toFixed(places);
      };

      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });

  targets.forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────────────────── hero staging ── */

/** The hero's own entrance: line masks give way to per-word timing. */
export function initHeroText(): void {
  const statement = document.querySelector<HTMLElement>('.hero-statement');

  if (statement && motionOn()) {
    const lines = Array.from(statement.querySelectorAll<HTMLElement>('.line > span'));
    let done = false;
    let last = 0;

    lines.forEach((line, i) => {
      const lead = 120 + i * 90;
      if (!split(line, 'word', lead)) return;

      line.classList.add('go');
      done = true;
      // when the last word of this line finishes arriving
      last = Math.max(last, lead + line.querySelectorAll('.w').length * 42 + 850);
    });

    if (done) {
      statement.classList.add('split-done');
      // the moving gradient waits until the words have stopped moving
      window.setTimeout(() => {
        statement.querySelectorAll('em').forEach(em => em.classList.add('sheen'));
      }, last);
    }
  } else {
    statement?.querySelectorAll('em').forEach(em => em.classList.add('sheen'));
  }

  const id = document.querySelector<HTMLElement>('.hero-id');
  if (id) splitOnView(id, 'char', 60);
}
