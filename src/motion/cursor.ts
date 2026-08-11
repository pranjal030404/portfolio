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

  const draw = () => {
    if (!running) return;

    dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;

    eased.x = approach(eased.x, pointer.x, 0.18);
    eased.y = approach(eased.y, pointer.y, 0.18);
    ring.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0)`;

    let lead = eased;
    beads.forEach((bead, i) => {
      bead.x = approach(bead.x, lead.x, 0.32 - i * 0.05);
      bead.y = approach(bead.y, lead.y, 0.32 - i * 0.05);
      trail[i].style.transform = `translate3d(${bead.x}px, ${bead.y}px, 0)`;
      lead = bead;
    });

    requestAnimationFrame(draw);
  };

  const start = () => {
    if (running || !motionOn()) return;
    running = true;
    document.body.classList.add('cursor-live');
    requestAnimationFrame(draw);
  };

  const stop = () => {
    running = false;
    cursor.classList.remove('live');
    document.body.classList.remove('cursor-live');
  };

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
      cursor.classList.add('live');
    }

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

  // leaving the window, or losing the pointer entirely
  document.addEventListener('pointerleave', () => cursor.classList.remove('live'));
  document.addEventListener('pointerenter', () => { if (running) cursor.classList.add('live'); });

  onMotionChange(on => {
    if (on) { if (seen) { start(); cursor.classList.add('live'); } }
    else stop();
  });

  // a mouse plugged in or unplugged mid-session
  fine.addEventListener('change', event => { if (!event.matches) stop(); });
}
