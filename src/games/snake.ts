import { GameHandle, token, store, save } from './types';

const COLS = 28;
const ROWS = 18;
const CELL = 26;
const BEST_KEY = 'portfolio_snake_high_score';

type State = 'ready' | 'playing' | 'paused' | 'gameover';
interface Cell { x: number; y: number; }

export function mount(root: HTMLElement): GameHandle {
  root.innerHTML = `
    <div class="g">
      <div class="g-board">
        <canvas class="g-canvas" width="${COLS * CELL}" height="${ROWS * CELL}"
                role="img" aria-label="Snake game board"></canvas>
        <div class="g-over" data-over>
          <strong data-over-title></strong>
          <p data-over-note></p>
          <button class="g-btn" type="button" data-over-action hidden></button>
        </div>
      </div>

      <div class="g-meta">
        <dl class="g-stats">
          <div><dt>Score</dt><dd data-score>0</dd></div>
          <div><dt>Best</dt><dd data-best>0</dd></div>
        </dl>
        <div class="g-actions">
          <button class="g-btn" type="button" data-restart>Restart</button>
          <button class="g-btn" type="button" data-pause>Pause</button>
        </div>
      </div>

      <div class="g-pad">
        <button class="u" type="button" aria-label="Up">↑</button>
        <button class="l" type="button" aria-label="Left">←</button>
        <button class="d" type="button" aria-label="Down">↓</button>
        <button class="r" type="button" aria-label="Right">→</button>
      </div>

      <p class="g-hint">Arrow keys or WASD · Space to pause</p>
    </div>
  `;

  const canvas = root.querySelector('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const overlay = root.querySelector('[data-over]') as HTMLElement;
  const overTitle = root.querySelector('[data-over-title]') as HTMLElement;
  const overNote = root.querySelector('[data-over-note]') as HTMLElement;
  const overAction = root.querySelector('[data-over-action]') as HTMLButtonElement;
  const scoreEl = root.querySelector('[data-score]') as HTMLElement;
  const bestEl = root.querySelector('[data-best]') as HTMLElement;
  const restartBtn = root.querySelector('[data-restart]') as HTMLButtonElement;
  const pauseBtn = root.querySelector('[data-pause]') as HTMLButtonElement;
  const pad = root.querySelector('.g-pad') as HTMLElement;

  let state: State = 'ready';
  let snake: Cell[] = [];
  let dir: Cell = { x: 1, y: 0 };
  let queued: Cell[] = [];
  let food: Cell = { x: 0, y: 0 };
  let score = 0;
  let best = store(BEST_KEY);
  let timer = 0;
  let speed = 130;

  bestEl.textContent = String(best);

  /* ── loop control: exactly one interval, always ── */

  const stopLoop = () => {
    window.clearInterval(timer);
    timer = 0;
  };

  const startLoop = () => {
    stopLoop();
    timer = window.setInterval(tick, speed);
  };

  /* ── rendering ── */

  const placeFood = () => {
    let spot: Cell;
    do {
      spot = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snake.some(part => part.x === spot.x && part.y === spot.y));
    food = spot;
  };

  const draw = () => {
    const bg = token('--sunk');
    const body = token('--text');
    const head = token('--accent');

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = head;
    ctx.lineWidth = 2;
    ctx.strokeRect(food.x * CELL + 5, food.y * CELL + 5, CELL - 10, CELL - 10);

    snake.forEach((part, index) => {
      ctx.fillStyle = index === 0 ? head : body;
      ctx.globalAlpha = index === 0 ? 1 : Math.max(0.3, 1 - index / (snake.length + 8));
      ctx.fillRect(part.x * CELL + 1, part.y * CELL + 1, CELL - 2, CELL - 2);
    });
    ctx.globalAlpha = 1;
  };

  /**
   * The overlay is driven purely by state — it is shown for ready, paused and
   * gameover, and hidden for playing. Nothing else touches its visibility.
   */
  const render = () => {
    draw();

    if (state === 'playing') {
      overlay.hidden = true;
    } else {
      overlay.hidden = false;

      if (state === 'ready') {
        overTitle.textContent = 'Ready';
        overNote.textContent = 'Press an arrow key to start';
        overAction.hidden = true;
      } else if (state === 'paused') {
        overTitle.textContent = 'Paused';
        overNote.textContent = 'Press Space to continue';
        overAction.hidden = true;
      } else {
        overTitle.textContent = 'Game over';
        overNote.textContent = `Score ${score}${score > 0 && score === best ? ' — new best' : ''}`;
        overAction.textContent = 'Restart';
        overAction.hidden = false;
      }
    }

    pauseBtn.disabled = state !== 'playing' && state !== 'paused';
    pauseBtn.textContent = state === 'paused' ? 'Resume' : 'Pause';
  };

  /* ── transitions ── */

  const toReady = () => {
    stopLoop();
    state = 'ready';

    const midY = Math.floor(ROWS / 2);
    snake = [{ x: 6, y: midY }, { x: 5, y: midY }, { x: 4, y: midY }];
    dir = { x: 1, y: 0 };
    queued = [];
    score = 0;
    speed = 130;
    scoreEl.textContent = '0';
    placeFood();
    render();
  };

  const toPlaying = () => {
    state = 'playing';
    render();
    startLoop();
  };

  const toGameOver = () => {
    stopLoop();
    state = 'gameover';

    if (score > best) {
      best = score;
      save(BEST_KEY, best);
      bestEl.textContent = String(best);
    }

    render();
  };

  const togglePause = () => {
    if (state === 'playing') {
      stopLoop();
      state = 'paused';
      render();
    } else if (state === 'paused') {
      toPlaying();
    }
  };

  /* ── stepping ── */

  function tick() {
    const next = queued.shift();
    if (next) dir = next;

    const head: Cell = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS) return toGameOver();
    if (snake.some(part => part.x === head.x && part.y === head.y)) return toGameOver();

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 1;
      scoreEl.textContent = String(score);
      speed = Math.max(65, speed - 4);
      startLoop();                       // re-arm at the new speed, never stacking
      placeFood();
    } else {
      snake.pop();
    }

    draw();
  }

  /**
   * A direction press means different things per state. From ready ANY of the
   * four directions begins the game — the reversal and duplicate guards only
   * apply once the snake is already moving, which is what previously stopped
   * Right and Left from ever starting it.
   */
  const press = (x: number, y: number) => {
    if (state === 'gameover') return;

    if (state === 'ready') {
      dir = { x, y };
      queued = [];
      toPlaying();
      return;
    }

    if (state !== 'playing') return;

    const last = queued.length ? queued[queued.length - 1] : dir;
    if (last.x === -x && last.y === -y) return;
    if (last.x === x && last.y === y) return;
    if (queued.length < 2) queued.push({ x, y });
  };

  /* ── input ── */

  const KEYS: Record<string, [number, number]> = {
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0]
  };

  const onKey = (event: KeyboardEvent) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

    if (key === ' ' || key === 'p') {
      if (state === 'playing' || state === 'paused') {
        event.preventDefault();
        togglePause();
      }
      return;
    }

    const move = KEYS[key];
    if (!move) return;

    // only swallow page scrolling while the board is live
    if (state === 'ready' || state === 'playing') event.preventDefault();
    press(move[0], move[1]);
  };

  const onPad = (event: Event) => {
    const button = (event.target as HTMLElement).closest('button');
    if (!button) return;
    const map: Record<string, [number, number]> = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
    const move = map[button.className];
    if (move) press(move[0], move[1]);
  };

  const onRestart = () => toReady();

  window.addEventListener('keydown', onKey);
  pad.addEventListener('click', onPad);
  restartBtn.addEventListener('click', onRestart);
  overAction.addEventListener('click', onRestart);
  pauseBtn.addEventListener('click', togglePause);

  toReady();

  return {
    destroy() {
      stopLoop();
      window.removeEventListener('keydown', onKey);
      pad.removeEventListener('click', onPad);
      restartBtn.removeEventListener('click', onRestart);
      overAction.removeEventListener('click', onRestart);
      pauseBtn.removeEventListener('click', togglePause);
      root.innerHTML = '';
    }
  };
}
