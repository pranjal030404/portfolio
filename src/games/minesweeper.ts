import { GameHandle, store, save } from './types';

const SIZE = 9;
const MINES = 10;
const BEST_KEY = 'portfolio_minesweeper_best_time';

interface Tile {
  mine: boolean;
  near: number;
  open: boolean;
  flag: boolean;
}

export function mount(root: HTMLElement): GameHandle {
  root.innerHTML = `
    <div class="g">
      <div class="g-board">
        <div class="grid grid-mines" data-grid role="grid" aria-label="Minesweeper board"></div>
        <div class="g-over" data-over hidden>
          <strong data-over-title></strong>
          <p data-over-note></p>
          <button class="g-btn" type="button" data-over-action>New game</button>
        </div>
      </div>

      <div class="g-meta">
        <dl class="g-stats">
          <div><dt>Mines</dt><dd data-mines>${MINES}</dd></div>
          <div><dt>Time</dt><dd data-time>0</dd></div>
          <div><dt>Best</dt><dd data-best>—</dd></div>
        </dl>
        <div class="g-actions">
          <button class="g-btn" type="button" data-new>New game</button>
        </div>
      </div>

      <p class="g-hint">Click to reveal · right click or long press to flag</p>
    </div>
  `;

  const gridEl = root.querySelector('[data-grid]') as HTMLElement;
  const overlay = root.querySelector('[data-over]') as HTMLElement;
  const overTitle = root.querySelector('[data-over-title]') as HTMLElement;
  const overNote = root.querySelector('[data-over-note]') as HTMLElement;
  const overAction = root.querySelector('[data-over-action]') as HTMLButtonElement;
  const minesEl = root.querySelector('[data-mines]') as HTMLElement;
  const timeEl = root.querySelector('[data-time]') as HTMLElement;
  const bestEl = root.querySelector('[data-best]') as HTMLElement;
  const newBtn = root.querySelector('[data-new]') as HTMLButtonElement;

  let tiles: Tile[] = [];
  let seeded = false;
  let done = false;
  let seconds = 0;
  let clock = 0;
  let best = store(BEST_KEY);
  let press = 0;

  if (best > 0) bestEl.textContent = `${best}s`;

  const index = (r: number, c: number) => r * SIZE + c;
  const inside = (r: number, c: number) => r >= 0 && c >= 0 && r < SIZE && c < SIZE;

  const neighbours = (i: number) => {
    const r = Math.floor(i / SIZE);
    const c = i % SIZE;
    const out: number[] = [];
    for (let dr = -1; dr <= 1; dr += 1) {
      for (let dc = -1; dc <= 1; dc += 1) {
        if (!dr && !dc) continue;
        if (inside(r + dr, c + dc)) out.push(index(r + dr, c + dc));
      }
    }
    return out;
  };

  /** Mines are laid after the first click so the opening move is never fatal. */
  const seed = (safe: number) => {
    const banned = new Set([safe, ...neighbours(safe)]);
    let placed = 0;

    while (placed < MINES) {
      const spot = Math.floor(Math.random() * tiles.length);
      if (banned.has(spot) || tiles[spot].mine) continue;
      tiles[spot].mine = true;
      placed += 1;
    }

    tiles.forEach((tile, i) => {
      tile.near = neighbours(i).filter(n => tiles[n].mine).length;
    });

    seeded = true;
  };

  const stopClock = () => { window.clearInterval(clock); clock = 0; };

  const startClock = () => {
    stopClock();
    clock = window.setInterval(() => {
      seconds += 1;
      timeEl.textContent = String(seconds);
    }, 1000);
  };

  const flagged = () => tiles.filter(t => t.flag).length;

  /* Built once, then updated in place — rebuilding innerHTML on every reveal
     would recreate the buttons and drop keyboard focus mid-game. */
  const build = () => {
    gridEl.innerHTML = tiles
      .map((_, i) => `<button class="tile" type="button" data-i="${i}"
             aria-label="cell ${Math.floor(i / SIZE) + 1}, ${(i % SIZE) + 1}"></button>`)
      .join('');
  };

  const render = () => {
    const nodes = gridEl.children;
    tiles.forEach((tile, i) => {
      const el = nodes[i] as HTMLElement;
      if (!el) return;

      const cls = ['tile'];
      let label = '';

      if (tile.open) {
        cls.push('open');
        if (tile.mine) { cls.push('mine'); label = '✳'; }
        else if (tile.near) { cls.push(`n${tile.near}`); label = String(tile.near); }
      } else if (tile.flag) {
        cls.push('flag');
        label = '⚑';
      }

      el.className = cls.join(' ');
      el.textContent = label;
    });

    minesEl.textContent = String(MINES - flagged());
  };

  const reveal = (i: number) => {
    const tile = tiles[i];
    if (tile.open || tile.flag) return;
    tile.open = true;

    if (tile.mine) return;
    if (tile.near === 0) neighbours(i).forEach(reveal);
  };

  const finish = (winner: boolean) => {
    done = true;
    stopClock();
    tiles.forEach(t => { if (t.mine) t.open = true; });
    render();

    if (winner) {
      overTitle.textContent = 'Cleared';
      if (best === 0 || seconds < best) {
        best = seconds;
        save(BEST_KEY, best);
        bestEl.textContent = `${best}s`;
        overNote.textContent = `${seconds}s — new best`;
      } else {
        overNote.textContent = `${seconds}s`;
      }
    } else {
      overTitle.textContent = 'Hit a mine';
      overNote.textContent = `After ${seconds}s`;
    }

    overlay.hidden = false;
  };

  const checkWin = () => {
    const closed = tiles.filter(t => !t.open).length;
    if (closed === MINES) finish(true);
  };

  const open = (i: number) => {
    if (done || tiles[i].flag) return;
    if (!seeded) { seed(i); startClock(); }

    reveal(i);
    render();

    if (tiles[i].mine) finish(false);
    else checkWin();
  };

  const flag = (i: number) => {
    if (done || tiles[i].open) return;
    tiles[i].flag = !tiles[i].flag;
    render();
  };

  const reset = () => {
    stopClock();
    tiles = Array.from({ length: SIZE * SIZE }, () => ({ mine: false, near: 0, open: false, flag: false }));
    seeded = false;
    done = false;
    seconds = 0;
    timeEl.textContent = '0';
    overlay.hidden = true;
    build();
    render();
  };

  const cellFrom = (event: Event) => {
    const button = (event.target as HTMLElement).closest('button[data-i]');
    return button ? Number((button as HTMLElement).dataset.i) : -1;
  };

  const onClick = (event: Event) => {
    const i = cellFrom(event);
    if (i >= 0) open(i);
  };

  const onContext = (event: Event) => {
    event.preventDefault();
    const i = cellFrom(event);
    if (i >= 0) flag(i);
  };

  // long press flags on touch
  const onDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') return;
    const i = cellFrom(event);
    if (i < 0) return;
    press = window.setTimeout(() => { press = 0; flag(i); }, 450);
  };

  const clearPress = () => {
    if (!press) return;
    window.clearTimeout(press);
    press = 0;
  };

  gridEl.addEventListener('click', onClick);
  gridEl.addEventListener('contextmenu', onContext);
  gridEl.addEventListener('pointerdown', onDown);
  gridEl.addEventListener('pointerup', clearPress);
  gridEl.addEventListener('pointercancel', clearPress);
  newBtn.addEventListener('click', reset);
  overAction.addEventListener('click', reset);

  reset();

  return {
    destroy() {
      stopClock();
      clearPress();
      gridEl.removeEventListener('click', onClick);
      gridEl.removeEventListener('contextmenu', onContext);
      gridEl.removeEventListener('pointerdown', onDown);
      gridEl.removeEventListener('pointerup', clearPress);
      gridEl.removeEventListener('pointercancel', clearPress);
      newBtn.removeEventListener('click', reset);
      overAction.removeEventListener('click', reset);
      root.innerHTML = '';
    }
  };
}
