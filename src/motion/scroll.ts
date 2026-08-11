import { motionOn, onMotionChange } from './prefs';
import { onScroll, refresh, clamp } from './frame';

/**
 * Scroll-driven motion: parallax layers, the timeline rail that draws itself
 * down the experience section, the pinned horizontal gallery, and the read
 * position readout.
 *
 * All of it goes through the shared frame loop, so the whole page still only
 * has one scroll listener doing work.
 */

/* ────────────────────────────────────────────────────────── parallax ── */

/**
 * Layers drift against the scroll at their own rate. Speed is per element:
 * data-parallax="0.12" moves 12% of the distance the page does.
 *
 * The offset is measured from the element's own position on screen, so a
 * layer sits exactly where the markup puts it when it is centred in the
 * viewport — no element is ever pushed out of its intended place.
 */
export function initParallax(): void {
  const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  if (!layers.length) return;

  const reset = () => layers.forEach(layer => { layer.style.transform = ''; });

  onScroll((y, vh) => {
    if (!motionOn()) return;

    layers.forEach(layer => {
      const speed = Number(layer.dataset.parallax) || 0.1;
      const box = layer.getBoundingClientRect();
      const middle = box.top + box.height / 2;

      // -1 at the bottom of the viewport, 0 in the middle, 1 at the top
      const across = (vh / 2 - middle) / (vh / 2 + box.height / 2);
      const shift = clamp(across, -1.4, 1.4) * speed * 100;

      layer.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    });

    void y;
  });

  onMotionChange(on => { if (!on) reset(); else refresh(); });
}

/* ───────────────────────────────────────────────────── timeline rail ── */

/** Draws the vertical rule beside the experience records as they scroll by. */
export function initRail(): void {
  const rail = document.querySelector<HTMLElement>('.rail');
  const fill = rail?.querySelector<HTMLElement>('i');
  const section = rail?.closest('section');
  if (!rail || !fill || !section) return;

  onScroll((y, vh) => {
    const box = section.getBoundingClientRect();
    // starts drawing when the section's top passes 80% down the viewport,
    // finishes when its bottom passes the middle
    const span = box.height + vh * 0.3;
    const drawn = clamp((vh * 0.8 - box.top) / span);

    fill.style.setProperty('--drawn', drawn.toFixed(3));
    void y;
  });
}

/* ─────────────────────────────────────────────── horizontal gallery ── */

/**
 * The gallery pins while the page keeps scrolling, and the track walks
 * sideways by exactly the distance it overflows. The section's height is
 * derived from that distance, so the amount of scrolling always matches the
 * amount of travel — no dead scroll at either end.
 *
 * Below 900px CSS turns the whole thing back into an ordinary swipeable
 * scroller, and this bows out.
 */
export function initGallery(): void {
  const section = document.getElementById('gallery');
  // the tall element is the run, not the section — the section also holds a
  // heading and a rail, and measuring against those would leave dead scroll
  // at one end of the track
  const run = document.getElementById('gallery-run');
  const pin = section?.querySelector<HTMLElement>('.gallery-pin');
  const track = document.getElementById('gallery-track');
  const rail = section?.querySelector<HTMLElement>('.gallery-rail i');
  if (!section || !run || !pin || !track) return;

  let travel = 0;
  let pinned = false;

  const measure = () => {
    pinned = window.innerWidth > 900 && motionOn();

    if (!pinned) {
      run.style.removeProperty('height');
      track.style.transform = '';
      return;
    }

    // clear the height first, or the pin is measured against the last one
    run.style.removeProperty('height');
    travel = Math.max(0, track.scrollWidth - pin.clientWidth);

    // one viewport of pinning plus a little over a pixel of scroll per pixel
    // of travel, so the sideways move doesn't outrun the wheel
    run.style.height = `${pin.clientHeight + travel * 1.15}px`;
  };

  onScroll(() => {
    if (!pinned) return;

    const box = run.getBoundingClientRect();
    const span = run.offsetHeight - pin.clientHeight;
    const progress = span > 0 ? clamp(-box.top / span) : 0;

    track.style.transform = `translate3d(${(-progress * travel).toFixed(1)}px, 0, 0)`;
    rail?.style.setProperty('--rail', progress.toFixed(3));
  });

  measure();
  window.addEventListener('resize', () => { measure(); refresh(); }, { passive: true });
  onMotionChange(() => { measure(); refresh(); });

  // cards can change height once the fonts land
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  fonts?.ready?.then(() => { measure(); refresh(); }).catch(() => { /* ignore */ });
}

/* ────────────────────────────────────────────────── read position ── */

/** The percentage beside the progress bar. Information, so it always runs. */
export function initReadout(): void {
  const readout = document.getElementById('progress-read');
  if (!readout) return;

  onScroll(y => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? clamp(y / max) : 0;

    readout.textContent = `${Math.round(progress * 100)}%`;
    readout.classList.toggle('on', y > 60);
  });
}

/* ──────────────────────────────────────────── reveal-on-view groups ── */

/**
 * A general "add .in when it arrives" observer for elements whose animation
 * lives entirely in CSS — the level bars, the flow steps, the timeline dots.
 * Separate from the reveal in ui.ts because these must run even for elements
 * that are already on screen at load.
 */
export function initInView(selector: string, threshold = 0.35): void {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll(selector).forEach(el => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { threshold });

  document.querySelectorAll(selector).forEach(el => observer.observe(el));
}
