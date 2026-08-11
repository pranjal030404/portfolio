/**
 * The single motion switch.
 *
 * Everything in the motion layer asks this module whether it may run, and
 * the stylesheet keys off one class (`body.motion-off`) rather than
 * repeating a media query per rule. The switch starts from the visitor's
 * system preference and can be overridden from the masthead; the override
 * is remembered, the system preference is followed whenever there isn't one.
 */

const KEY = 'motion';

type Listener = (on: boolean) => void;

const system = window.matchMedia('(prefers-reduced-motion: reduce)');
const listeners = new Set<Listener>();

const stored = (() => {
  try { return localStorage.getItem(KEY); } catch { return null; }
})();

let on = stored === null ? !system.matches : stored === 'on';

const paint = () => {
  document.body.classList.toggle('motion-off', !on);
  document.querySelectorAll('.tool-motion').forEach(button => {
    button.setAttribute('aria-pressed', String(!on));
    button.setAttribute('aria-label', on ? 'Turn animation off' : 'Turn animation on');
  });
};

const announce = () => {
  paint();
  listeners.forEach(listener => listener(on));
};

/** Whether decorative motion is allowed to run right now. */
export const motionOn = (): boolean => on;

/** Runs `listener` on every change. Returns nothing — nothing unsubscribes. */
export function onMotionChange(listener: Listener): void {
  listeners.add(listener);
}

export function setMotion(next: boolean): void {
  if (next === on) return;
  on = next;
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* private mode */ }
  announce();
}

export function initMotionSwitch(): void {
  paint();

  document.querySelectorAll<HTMLButtonElement>('.tool-motion').forEach(button => {
    button.addEventListener('click', () => setMotion(!on));
  });

  // a change to the system setting only leads while the visitor hasn't
  // expressed one of their own
  system.addEventListener('change', event => {
    let explicit: string | null = null;
    try { explicit = localStorage.getItem(KEY); } catch { /* ignore */ }
    if (explicit !== null) return;
    on = !event.matches;
    announce();
  });
}
