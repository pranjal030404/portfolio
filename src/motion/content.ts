/**
 * The blocks that need script to arrange themselves: the marquees and the
 * technology cloud.
 *
 * Both are readable with script off — the marquee is a list of names, the
 * cloud is a line of names. Script only arranges and animates what is
 * already there.
 */

/* ────────────────────────────────────────────────────────── marquee ── */

/**
 * A CSS marquee that translates by -100% needs the run duplicated exactly
 * once for the loop to be seamless, and needs the pair to be at least twice
 * the strip's width or there is a gap at the turn. Clone until both hold.
 */
export function initMarquee(): void {
  document.querySelectorAll<HTMLElement>('.marquee').forEach(marquee => {
    const run = marquee.querySelector<HTMLElement>('.marquee-run');
    if (!run) return;

    let guard = 0;
    while (run.scrollWidth < marquee.parentElement!.clientWidth && guard < 4) {
      run.append(...Array.from(run.children).map(child => child.cloneNode(true)));
      guard += 1;
    }

    const twin = run.cloneNode(true) as HTMLElement;
    twin.setAttribute('aria-hidden', 'true');
    marquee.append(twin);
  });
}

/* ────────────────────────────────────────────────────────── cloud ── */

/**
 * Scatters the technology names across the panel and gives each its own
 * drift. Positions come from a fixed seed rather than Math.random so the
 * layout is the same on every visit — a cloud that reshuffles on reload
 * reads as a bug.
 */
export function initCloud(): void {
  const cloud = document.querySelector<HTMLElement>('.cloud');
  if (!cloud) return;

  const names = Array.from(cloud.querySelectorAll<HTMLElement>('b'));
  if (!names.length) return;

  // a small deterministic generator — same sequence every time
  let seed = 20260404;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  // Fewer columns so long names ("Socket.io", "REST APIs") get horizontal
  // room, and more rows so the panel fills top to bottom instead of leaving
  // a dead band underneath.
  const columns = Math.max(3, Math.round(Math.sqrt(names.length * 1.05)));
  const rows = Math.ceil(names.length / columns);

  names.forEach((name, i) => {
    const column = i % columns;
    const row = Math.floor(i / columns);

    // A brick layout: every other row is offset half a cell, which reads as
    // organic without the collisions a big random jitter causes. The jitter
    // that remains is small and deterministic.
    const brick = (row % 2) * 0.5;
    const cx = ((column + 0.5 + brick) / columns) * 100 + (next() - 0.5) * (16 / columns);
    const cy = ((row + 0.5) / rows) * 100 + (next() - 0.5) * (12 / rows);

    const x = clamp(cx, 7, 93);
    const y = clamp(cy, 8, 92);
    const weight = Number(name.dataset.w ?? next().toFixed(2));

    name.style.left = `${x.toFixed(1)}%`;
    name.style.top = `${y.toFixed(1)}%`;
    name.style.translate = '-50% -50%';
    name.style.setProperty('--w', String(weight));
    name.style.setProperty('--i', String(i));
    name.style.setProperty('--dx', `${(next() * 14 - 7).toFixed(1)}px`);
    name.style.setProperty('--dy', `${(next() * 14 - 7).toFixed(1)}px`);
    name.style.setProperty('--dur', `${(14 + next() * 8).toFixed(1)}s`);
  });

  cloud.classList.add('placed');
}

/* ────────────────────────────────────────────── details stagger ── */

/** Numbers the children of collapsible panels so they open in sequence. */
export function initStaggerIndices(): void {
  document.querySelectorAll('[data-stagger], .duties, .arch-chain').forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      (child as HTMLElement).style.setProperty('--i', String(i));
    });
  });
}
