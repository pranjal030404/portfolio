import { motionOn } from './prefs';

/**
 * The intro. Holds the page for as long as the first paint genuinely needs
 * and no longer — the counter tracks real progress (fonts, then the window
 * load event), and the whole thing is capped so a slow font CDN can never
 * keep a visitor staring at a splash screen.
 */

const CAP = 2200;

export function initCurtain(): void {
  const curtain = document.getElementById('curtain');
  if (!curtain) return;

  const count = document.getElementById('curtain-count');
  const fill = document.getElementById('curtain-fill');

  if (!motionOn()) {
    curtain.remove();
    document.documentElement.classList.remove('booting');
    return;
  }

  let done = false;
  let shown = 0;
  let target = 8;
  let frame = 0;

  const draw = () => {
    frame = 0;
    shown += (target - shown) * 0.12;
    if (target - shown < 0.4) shown = target;

    if (count) count.textContent = String(Math.round(shown)).padStart(2, '0');
    if (fill) fill.style.transform = `scaleX(${(shown / 100).toFixed(3)})`;

    if (shown < target) frame = requestAnimationFrame(draw);
    else if (target === 100) lift();
  };

  const to = (value: number) => {
    target = Math.max(target, value);
    if (!frame) frame = requestAnimationFrame(draw);
  };

  const lift = () => {
    if (done) return;
    done = true;

    curtain.classList.add('up');
    document.documentElement.classList.remove('booting');
    document.dispatchEvent(new CustomEvent('curtain:up'));

    curtain.addEventListener('transitionend', () => curtain.remove(), { once: true });
    window.setTimeout(() => curtain.remove(), 1600);
  };

  to(24);

  // real signals, in the order they arrive
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  if (fonts?.ready) fonts.ready.then(() => to(72)).catch(() => to(72));
  else to(72);

  if (document.readyState === 'complete') to(100);
  else window.addEventListener('load', () => to(100), { once: true });

  // and the promise that this ends regardless
  window.setTimeout(() => { target = 100; to(100); }, CAP);
}
