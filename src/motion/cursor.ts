import { motionOn, onMotionChange } from './prefs';
import { approach } from './frame';

/**
 * The custom cursor: a dot that tracks the pointer exactly, a ring that
 * eases behind it, and a short trail behind that. The ring reads the thing
 * under the pointer and changes shape — wide over anything clickable, a
 * reading bar over running text, a labelled disc where an element says what
 * it does via data-cursor.
 *
 * Fine pointers only. On touch and stylus the system cursor is the right
 * answer and this never starts.
 */

const TRAIL = 4;

const TEXTY = 'p, h1, h2, h3, li, dd, dt, blockquote, .hero-sub, .record-text, .case-text';

export function initCursor(): void {
  const fine = window.matchMedia('(pointer: fine)');
  if (!fine.matches) return;

  const cursor = document.getElementById('cursor');
  const dot = cursor?.querySelector<HTMLElement>('.cursor-dot');
  const ring = cursor?.querySelector<HTMLElement>('.cursor-ring');
  const label = cursor?.querySelector<HTMLElement>('.cursor-label');
  if (!cursor || !dot || !ring || !label) return;

  const trail: HTMLElement[] = [];
  for (let i = 0; i < TRAIL; i += 1) {
    const bead = document.createElement('span');
    bead.className = 'trail';
    bead.style.opacity = String(0.34 - i * 0.07);
    bead.style.scale = String(1 - i * 0.16);
    document.body.append(bead);
    trail.push(bead);
  }

  const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
  const eased = { x: pointer.x, y: pointer.y };
  const beads = trail.map(() => ({ x: pointer.x, y: pointer.y }));

  let running = false;
  let seen = false;
  let last = 0;

  // approach() eases by a fixed fraction per call, so its speed is tied to
  // however often draw() happens to run. On a 144Hz display, or after a
  // dropped frame drags two ticks' worth of movement into one, that fraction
  // is wrong — the ring visibly surges or crawls. Raising the per-frame rate
  // to the number of 60fps-equivalent frames actually elapsed keeps the ease
  // reading the same speed regardless of refresh rate or frame drops.
  const rateFor = (perFrame: number, frames: number) => 1 - (1 - perFrame) ** frames;

  const draw = (now: number) => {
    if (!running) return;

    const dt = last === 0 ? 16.67 : Math.min(now - last, 100);
    last = now;
    const frames = dt / 16.67;

    dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;

    eased.x = approach(eased.x, pointer.x, rateFor(0.18, frames));
    eased.y = approach(eased.y, pointer.y, rateFor(0.18, frames));
    ring.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0)`;

    let lead = eased;
    beads.forEach((bead, i) => {
      const rate = rateFor(0.32 - i * 0.05, frames);
      bead.x = approach(bead.x, lead.x, rate);
      bead.y = approach(bead.y, lead.y, rate);
      trail[i].style.transform = `translate3d(${bead.x}px, ${bead.y}px, 0)`;
      lead = bead;
    });

    requestAnimationFrame(draw);
  };

  const start = () => {
    if (running || !motionOn()) return;
    running = true;
    last = 0;
    document.body.classList.add('cursor-live');
    requestAnimationFrame(draw);
  };

  const stop = () => {
    running = false;
    cursor.classList.remove('live');
    document.body.classList.remove('cursor-live');
  };

  const hide = () => cursor.classList.remove('live');

  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;

    pointer.x = event.clientX;
    pointer.y = event.clientY;

    if (!seen) {
      seen = true;
      eased.x = pointer.x;
      eased.y = pointer.y;
      beads.forEach(bead => { bead.x = pointer.x; bead.y = pointer.y; });
      start();
    }

    // Re-asserted on every move rather than left to pointerenter alone —
    // pointerenter/pointerleave don't fire reliably across iframe, scrollbar
    // and devtools-panel boundaries in every browser, and a missed one used
    // to leave the cursor stuck invisible until reload. A move always means
    // it should be showing.
    if (running) cursor.classList.add('live');

    const target = event.target as Element | null;
    if (!target?.closest) return;

    const said = target.closest<HTMLElement>('[data-cursor]');
    const hot = target.closest('a, button, summary, input, textarea, label, [role="button"]');

    cursor.classList.toggle('labelled', Boolean(said));
    cursor.classList.toggle('hot', Boolean(hot) && !said);
    cursor.classList.toggle('text', !hot && !said && Boolean(target.closest(TEXTY)));

    label.textContent = said?.dataset.cursor ?? '';
  }, { passive: true });

  document.addEventListener('pointerdown', () => cursor.classList.add('down'));
  document.addEventListener('pointerup', () => cursor.classList.remove('down'));

  // leaving the window, or losing the pointer entirely — pointerleave is the
  // primary signal, pointerout with a null relatedTarget is the fallback for
  // browsers that don't fire pointerleave on the document reliably, and blur
  // / visibilitychange catch an alt-tab or devtools focus grab mid-hover.
  document.addEventListener('pointerleave', hide);
  document.addEventListener('pointerout', event => { if (!event.relatedTarget) hide(); });
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  document.addEventListener('pointerenter', () => { if (running) cursor.classList.add('live'); });

  onMotionChange(on => {
    if (on) { if (seen) { start(); cursor.classList.add('live'); } }
    else stop();
  });

  // a mouse plugged in or unplugged mid-session
  fine.addEventListener('change', event => { if (!event.matches) stop(); });
}
