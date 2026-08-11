/**
 * One scroll listener and one animation frame for every scroll-driven
 * effect on the page — parallax, the pinned gallery, the timeline rail,
 * the masthead and the read position all subscribe here.
 *
 * The alternative is a dozen listeners each asking the browser for layout
 * on the same frame, which is how a page ends up janky while every
 * individual effect looks cheap.
 */

type Reader = (y: number, vh: number) => void;

const readers = new Set<Reader>();
let frame = 0;
let bound = false;

const run = () => {
  frame = 0;
  const y = window.scrollY;
  const vh = window.innerHeight;
  readers.forEach(reader => reader(y, vh));
};

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(run);
};

/** Subscribe to scroll and resize. Returns an unsubscribe. */
export function onScroll(reader: Reader): () => void {
  readers.add(reader);

  if (!bound) {
    bound = true;
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
  }

  schedule();
  return () => { readers.delete(reader); };
}

/** Ask for a recalculation — after a layout change nothing else reports. */
export const refresh = (): void => schedule();

/** Frame-rate independent easing towards a target. */
export const approach = (from: number, to: number, rate: number): number =>
  from + (to - from) * rate;

export const clamp = (value: number, min = 0, max = 1): number =>
  value < min ? min : value > max ? max : value;
