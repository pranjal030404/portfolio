import { motionOn } from './prefs';

/**
 * Magnetic elements. Inside a radius around the element the pointer pulls it
 * a little off its resting position; outside, it springs back on its own
 * transition. The pull is capped well under the element's own size so text
 * never separates from the box it belongs to.
 *
 * One pointermove listener for the whole page. Rectangles are read on
 * pointerenter rather than every frame.
 */

type Magnet = {
  el: HTMLElement;
  strength: number;
  box: DOMRect;
};

const RADIUS = 90;

export function initMagnetic(): void {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const magnets: Magnet[] = Array.from(
    document.querySelectorAll<HTMLElement>('[data-magnetic]')
  ).map(el => ({
    el,
    strength: Number(el.dataset.magnetic) || 0.32,
    box: el.getBoundingClientRect()
  }));

  if (!magnets.length) return;

  let active: Magnet | null = null;

  const release = (magnet: Magnet) => {
    magnet.el.classList.remove('pulling');
    magnet.el.style.removeProperty('--mx');
    magnet.el.style.removeProperty('--my');
  };

  magnets.forEach(magnet => {
    magnet.el.addEventListener('pointerenter', () => {
      if (!motionOn()) return;
      magnet.box = magnet.el.getBoundingClientRect();
      active = magnet;
      magnet.el.classList.add('pulling');
    });

    magnet.el.addEventListener('pointerleave', () => {
      if (active === magnet) active = null;
      release(magnet);
    });
  });

  document.addEventListener('pointermove', event => {
    if (!active || !motionOn()) return;

    const { box, strength, el } = active;
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;

    // fall off with distance, so the pull is strongest at the centre
    const reach = Math.max(box.width, box.height) / 2 + RADIUS;
    const falloff = Math.max(0, 1 - Math.hypot(dx, dy) / reach);

    el.style.setProperty('--mx', `${(dx * strength * falloff).toFixed(2)}px`);
    el.style.setProperty('--my', `${(dy * strength * falloff).toFixed(2)}px`);
  }, { passive: true });

  // a scroll moves every box out from under its cached rectangle
  window.addEventListener('scroll', () => {
    if (!active) return;
    active.box = active.el.getBoundingClientRect();
  }, { passive: true });

  window.addEventListener('resize', () => {
    magnets.forEach(magnet => { magnet.box = magnet.el.getBoundingClientRect(); });
  }, { passive: true });
}
