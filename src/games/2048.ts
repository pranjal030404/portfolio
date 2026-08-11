import { GameHandle, store, save } from './types';

const SIZE = 4;
const BEST_KEY = 'portfolio_2048_best';

export function mount(root: HTMLElement): GameHandle {
  root.innerHTML = `
    <div class="g">
      <div class="g-board">
        <div class="grid grid-2048" data-grid role="grid" aria-label="2048 board"></div>
        <div class="g-over" data-over hidden>
          <strong data-over-title></strong>
          <p data-over-note></p>
          <button class="g-btn" type="button" data-over-action></button>
        </div>
      </div>

      <div class="g-meta">
        <dl class="g-stats">
          <div><dt>Score</dt><dd data-score>0</dd></div>
          <div><dt>Best</dt><dd data-best>0</dd></div>
        </dl>
        <div class="g-actions">
          <button class="g-btn" type="button" data-new>New game</button>
        </div>
      </div>

      <p class="g-hint">Arrow keys or WASD · swipe on touch</p>
    </div>
  `;

  const gridEl = root.querySelector('[data-grid]') as HTMLElement;
  const overlay = root.querySelector('[data-over]') as HTMLElement;
  const overTitle = root.querySelector('[data-over-title]') as HTMLElement;
  const overNote = root.querySelector('[data-over-note]') as HTMLElement;
  const overAction = root.querySelector('[data-over-action]') as HTMLButtonElement;
  const scoreEl = root.querySelector('[data-score]') as HTMLElement;
  const bestEl = root.querySelector('[data-best]') as HTMLElement;
  const newBtn = root.querySelector('[data-new]') as HTMLButtonElement;

  let cells: number[] = [];
  let score = 0;
  let best = store(BEST_KEY);
  let over = false;
  let won = false;

  bestEl.textContent = String(best);

  const at = (r: number, c: number) => cells[r * SIZE + c];
  const put = (r: number, c: number, v: number) => { cells[r * SIZE + c] = v; };

  const spawn = () => {
    const empty: number[] = [];
    cells.forEach((v, i) => { if (v === 0) empty.push(i); });
    if (!empty.length) return;
    cells[empty[Math.floor(Math.random() * empty.length)]] = Math.random() < 0.9 ? 2 : 4;
  };

  const render = () => {
    gridEl.innerHTML = cells
      .map(v => `<div class="tile${v ? ` t${v > 2048 ? 'max' : v}` : ' t0'}" role="gridcell">${v || ''}</div>`)
      .join('');
    scoreEl.textContent = String(score);
  };

  /** Collapses one line toward index 0, returning the new line and points won. */
  const collapse = (line: number[]) => {
    const kept = line.filter(Boolean);
    const out: number[] = [];
    let gained = 0;

    for (let i = 0; i < kept.length; i += 1) {
      if (kept[i] === kept[i + 1]) {
        const merged = kept[i] * 2;
        out.push(merged);
        gained += merged;
        if (merged === 2048) won = true;
        i += 1;
      } else {
        out.push(kept[i]);
      }
    }

    while (out.length < SIZE) out.push(0);
    return { out, gained };
  };

  const readLine = (index: number, dir: 'left' | 'right' | 'up' | 'down') => {
    const line: number[] = [];
    for (let i = 0; i < SIZE; i += 1) {
      if (dir === 'left') line.push(at(index, i));
      else if (dir === 'right') line.push(at(index, SIZE - 1 - i));
      else if (dir === 'up') line.push(at(i, index));
      else line.push(at(SIZE - 1 - i, index));
    }
    return line;
  };

  const writeLine = (index: number, dir: 'left' | 'right' | 'up' | 'down', line: number[]) => {
    for (let i = 0; i < SIZE; i += 1) {
      if (dir === 'left') put(index, i, line[i]);
      else if (dir === 'right') put(index, SIZE - 1 - i, line[i]);
      else if (dir === 'up') put(i, index, line[i]);
      else put(SIZE - 1 - i, index, line[i]);
    }
  };

  const move = (dir: 'left' | 'right' | 'up' | 'down') => {
    if (over) return;

    const before = cells.join(',');
    let gained = 0;

    for (let i = 0; i < SIZE; i += 1) {
      const result = collapse(readLine(i, dir));
      gained += result.gained;
      writeLine(i, dir, result.out);
    }

    if (cells.join(',') === before) return;   // nothing shifted — not a move

    score += gained;
    if (score > best) {
      best = score;
      save(BEST_KEY, best);
      bestEl.textContent = String(best);
    }

    spawn();
    render();
    checkEnd();
  };

  const canMove = () => {
    if (cells.includes(0)) return true;
    for (let r = 0; r < SIZE; r += 1) {
      for (let c = 0; c < SIZE; c += 1) {
        const v = at(r, c);
        if (c + 1 < SIZE && at(r, c + 1) === v) return true;
        if (r + 1 < SIZE && at(r + 1, c) === v) return true;
      }
    }
    return false;
  };

  const checkEnd = () => {
    if (won) {
      won = false;
      overTitle.textContent = '2048';
      overNote.textContent = `Reached it at ${score} points`;
      overAction.textContent = 'Keep going';
      overlay.hidden = false;
      return;
    }

    if (!canMove()) {
      over = true;
      overTitle.textContent = 'No moves left';
      overNote.textContent = `Score ${score}`;
      overAction.textContent = 'New game';
      overlay.hidden = false;
    }
  };

  const reset = () => {
    cells = new Array(SIZE * SIZE).fill(0);
    score = 0;
    over = false;
    won = false;
    overlay.hidden = true;
    spawn();
    spawn();
    render();
  };

  const KEYS: Record<string, 'left' | 'right' | 'up' | 'down'> = {
    ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
    a: 'left', d: 'right', w: 'up', s: 'down'
  };

  const onKey = (event: KeyboardEvent) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    const dir = KEYS[key];
    if (!dir) return;
    event.preventDefault();
    move(dir);
  };

  let sx = 0;
  let sy = 0;

  const onDown = (event: PointerEvent) => { sx = event.clientX; sy = event.clientY; };

  const onUp = (event: PointerEvent) => {
    const dx = event.clientX - sx;
    const dy = event.clientY - sy;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  };

  const onOverAction = () => {
    if (over) reset();
    else overlay.hidden = true;      // "keep going" after 2048
  };

  window.addEventListener('keydown', onKey);
  gridEl.addEventListener('pointerdown', onDown);
  gridEl.addEventListener('pointerup', onUp);
  newBtn.addEventListener('click', reset);
  overAction.addEventListener('click', onOverAction);

  reset();

  return {
    destroy() {
      window.removeEventListener('keydown', onKey);
      gridEl.removeEventListener('pointerdown', onDown);
      gridEl.removeEventListener('pointerup', onUp);
      newBtn.removeEventListener('click', reset);
      overAction.removeEventListener('click', onOverAction);
      root.innerHTML = '';
    }
  };
}
