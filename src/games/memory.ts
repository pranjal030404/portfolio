import { GameHandle, store, save } from './types';

const BEST_KEY = 'portfolio_memory_best_moves';

/* geometric marks rather than emoji — they sit inside the page's type */
const MARKS = ['{ }', '[ ]', '< >', '( )', '/', '\\', '+', '='];

export function mount(root: HTMLElement): GameHandle {
  root.innerHTML = `
    <div class="g">
      <div class="g-board">
        <div class="grid grid-memory" data-grid role="grid" aria-label="Memory board"></div>
        <div class="g-over" data-over hidden>
          <strong data-over-title></strong>
          <p data-over-note></p>
          <button class="g-btn" type="button" data-over-action>Play again</button>
        </div>
      </div>

      <div class="g-meta">
        <dl class="g-stats">
          <div><dt>Moves</dt><dd data-moves>0</dd></div>
          <div><dt>Time</dt><dd data-time>0</dd></div>
          <div><dt>Best</dt><dd data-best>—</dd></div>
        </dl>
        <div class="g-actions">
          <button class="g-btn" type="button" data-new>New game</button>
        </div>
      </div>

      <p class="g-hint">Find the eight pairs in as few moves as you can</p>
    </div>
  `;

  const gridEl = root.querySelector('[data-grid]') as HTMLElement;
  const overlay = root.querySelector('[data-over]') as HTMLElement;
  const overTitle = root.querySelector('[data-over-title]') as HTMLElement;
  const overNote = root.querySelector('[data-over-note]') as HTMLElement;
  const overAction = root.querySelector('[data-over-action]') as HTMLButtonElement;
  const movesEl = root.querySelector('[data-moves]') as HTMLElement;
  const timeEl = root.querySelector('[data-time]') as HTMLElement;
  const bestEl = root.querySelector('[data-best]') as HTMLElement;
  const newBtn = root.querySelector('[data-new]') as HTMLButtonElement;

  let cards: string[] = [];
  let open: number[] = [];
  let matched = new Set<number>();
  let moves = 0;
  let seconds = 0;
  let clock = 0;
  let settle = 0;
  let started = false;
  let best = store(BEST_KEY);

  if (best > 0) bestEl.textContent = String(best);

  const stopClock = () => { window.clearInterval(clock); clock = 0; };

  const startClock = () => {
    stopClock();
    clock = window.setInterval(() => {
      seconds += 1;
      timeEl.textContent = String(seconds);
    }, 1000);
  };

  /* Built once, then updated in place — rebuilding innerHTML on every flip
     would recreate the buttons and drop keyboard focus mid-game. */
  const build = () => {
    gridEl.innerHTML = cards
      .map((_, i) => `<button class="card" type="button" data-i="${i}"></button>`)
      .join('');
  };

  const render = () => {
    const nodes = gridEl.children;
    cards.forEach((mark, i) => {
      const el = nodes[i] as HTMLElement;
      if (!el) return;
      const shown = open.includes(i) || matched.has(i);
      el.className = `card${shown ? ' up' : ''}${matched.has(i) ? ' done' : ''}`;
      el.textContent = shown ? mark : '';
      el.setAttribute('aria-label', shown ? `card ${mark}` : 'hidden card');
    });
    movesEl.textContent = String(moves);
  };

  const finish = () => {
    stopClock();
    overTitle.textContent = 'Cleared';

    if (best === 0 || moves < best) {
      best = moves;
      save(BEST_KEY, best);
      bestEl.textContent = String(best);
      overNote.textContent = `${moves} moves in ${seconds}s — new best`;
    } else {
      overNote.textContent = `${moves} moves in ${seconds}s`;
    }

    overlay.hidden = false;
  };

  const flip = (i: number) => {
    if (settle) return;
    if (matched.has(i) || open.includes(i) || open.length === 2) return;

    if (!started) { started = true; startClock(); }

    open.push(i);
    render();

    if (open.length < 2) return;

    moves += 1;
    movesEl.textContent = String(moves);

    const [a, b] = open;
    if (cards[a] === cards[b]) {
      matched.add(a);
      matched.add(b);
      open = [];
      render();
      if (matched.size === cards.length) finish();
      return;
    }

    settle = window.setTimeout(() => {
      settle = 0;
      open = [];
      render();
    }, 700);
  };

  const reset = () => {
    stopClock();
    window.clearTimeout(settle);
    settle = 0;
    cards = [...MARKS, ...MARKS].sort(() => Math.random() - 0.5);
    open = [];
    matched = new Set();
    moves = 0;
    seconds = 0;
    started = false;
    timeEl.textContent = '0';
    overlay.hidden = true;
    build();
    render();
  };

  const onClick = (event: Event) => {
    const button = (event.target as HTMLElement).closest('button[data-i]');
    if (!button) return;
    flip(Number((button as HTMLElement).dataset.i));
  };

  gridEl.addEventListener('click', onClick);
  newBtn.addEventListener('click', reset);
  overAction.addEventListener('click', reset);

  reset();

  return {
    destroy() {
      stopClock();
      window.clearTimeout(settle);
      settle = 0;
      gridEl.removeEventListener('click', onClick);
      newBtn.removeEventListener('click', reset);
      overAction.removeEventListener('click', reset);
      root.innerHTML = '';
    }
  };
}
