import { motionOn } from './prefs';

/**
 * 3D tilt for cards. The element declares itself with data-tilt; script only
 * writes two angles and a glare position as custom properties, and the
 * stylesheet composes the transform. That keeps the resting state, the
 * settle-back transition and the reduced-motion override in CSS where they
 * belong.
 *
 * Angles are small on purpose — a card that swings hard reads as a toy.
 */

const MAX = 7;

export function initTilt(): void {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'));
  if (!cards.length) return;

  cards.forEach(card => {
    // the glare needs a surface to sit on and something to clip it
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
    if (!card.querySelector('.glare')) {
      const glare = document.createElement('span');
      glare.className = 'glare';
      glare.setAttribute('aria-hidden', 'true');
      card.append(glare);
    }

    const limit = Number(card.dataset.tilt) || MAX;
    let box: DOMRect | null = null;
    let frame = 0;
    let point = { x: 0, y: 0 };

    const write = () => {
      frame = 0;
      if (!box) return;

      const px = (point.x - box.left) / box.width;
      const py = (point.y - box.top) / box.height;

      card.style.setProperty('--ry', `${((px - 0.5) * 2 * limit).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${((0.5 - py) * 2 * limit).toFixed(2)}deg`);
      card.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
    };

    card.addEventListener('pointerenter', event => {
      if (!motionOn() || event.pointerType !== 'mouse') return;
      box = card.getBoundingClientRect();
      card.classList.add('tilting');
      card.style.setProperty('--tilt-scale', '1.02');
    });

    card.addEventListener('pointermove', event => {
      if (!box || !motionOn()) return;
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(write);
    }, { passive: true });

    const settle = () => {
      box = null;
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
      card.classList.remove('tilting');
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
      card.style.removeProperty('--tilt-scale');
    };

    card.addEventListener('pointerleave', settle);
    card.addEventListener('pointercancel', settle);
    // a card can be tabbed to and then scrolled away from
    card.addEventListener('focusout', settle);
  });
}
