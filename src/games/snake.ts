import { GameHandle, token, store, save } from './types';

const COLS = 24;
const ROWS = 18;
const CELL = 20;
const BEST_KEY = 'portfolio_snake_high_score';

interface Cell { x: number; y: number; }

export function mount(root: HTMLElement): GameHandle {
  root.innerHTML = `
    <div class="g">
      <div class="g-board">
        <canvas class="g-canvas" width="${COLS * CELL}" height="${ROWS * CELL}"
                role="img" aria-label="Snake game board"></canvas>
        <div class="g-over" hidden>
          <strong data-over-title>Ready</strong>
          <p data-over-note>Press an arrow key to start</p>
        </div>
        <div class="g-pad">
          <button class="u" type="button" aria-label="Up">↑</button>
          <button class="l" type="button" aria-label="Left">←</button>
          <button class="d" type="button" aria-label="Down">↓</button>
          <button class="r" type="button" aria-label="Right">→</button>
        </div>
      </div>

      <div class="g-side">
        <div>
          <dl class="g-stat"><dt>Score</dt><dd data-score>0</dd></dl>
          <dl class="g-stat"><dt>Best</dt><dd data-best>0</dd></dl>
        </div>
        <button class="g-btn" type="button" data-restart>Restart</button>
        <p class="g-hint">Arrow keys or WASD.<br>Space pauses.</p>
      </div>
    </div>
  `;

  const canvas = root.querySelector('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const overlay = root.querySelector('.g-over') as HTMLElement;
  const overTitle = root.querySelector('[data-over-title]') as HTMLElement;
  const overNote = root.querySelector('[data-over-note]') as HTMLElement;
  const scoreEl = root.querySelector('[data-score]') as HTMLElement;
  const bestEl = root.querySelector('[data-best]') as HTMLElement;

  let snake: Cell[] = [];
  let dir: Cell = { x: 1, y: 0 };
  let queued: Cell[] = [];
  let food: Cell = { x: 0, y: 0 };
  let score = 0;
  let best = store(BEST_KEY);
  let timer = 0;
  let speed = 130;
  let state: 'idle' | 'running' | 'paused' | 'over' = 'idle';

  bestEl.textContent = String(best);

  const placeFood = () => {
    let spot: Cell;
    do {
      spot = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snake.some(part => part.x === spot.x && part.y === spot.y));
    food = spot;
  };

  const reset = () => {
    const midY = Math.floor(ROWS / 2);
    snake = [{ x: 6, y: midY }, { x: 5, y: midY }, { x: 4, y: midY }];
    dir = { x: 1, y: 0 };
    queued = [];
    score = 0;
    speed = 130;
    scoreEl.textContent = '0';
    placeFood();
    draw();
  };

  const draw = () => {
    const bg = token('--sunk');
    const body = token('--text');
    const head = token('--accent');
    const dim = token('--border');

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // food
    ctx.strokeStyle = head;
    ctx.lineWidth = 2;
    ctx.strokeRect(food.x * CELL + 4, food.y * CELL + 4, CELL - 8, CELL - 8);

    // snake
    snake.forEach((part, index) => {
      ctx.fillStyle = index === 0 ? head : body;
      ctx.globalAlpha = index === 0 ? 1 : Math.max(0.35, 1 - index / (snake.length + 6));
      ctx.fillRect(part.x * CELL + 1, part.y * CELL + 1, CELL - 2, CELL - 2);
    });
    ctx.globalAlpha = 1;

    if (state === 'paused') {
      ctx.fillStyle = dim;
      ctx.font = '12px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
  };

  const gameOver = () => {
    state = 'over';
    window.clearInterval(timer);
    timer = 0;

    if (score > best) {
      best = score;
      save(BEST_KEY, best);
      bestEl.textContent = String(best);
      overTitle.textContent = `New best — ${score}`;
    } else {
      overTitle.textContent = `Score ${score}`;
    }

    overNote.textContent = 'Restart, or press an arrow key';
    overlay.hidden = false;
  };

  const tick = () => {
    const next = queued.shift();
    if (next) dir = next;

    const head: Cell = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS) return gameOver();
    if (snake.some(part => part.x === head.x && part.y === head.y)) return gameOver();

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 1;
      scoreEl.textContent = String(score);
      speed = Math.max(65, speed - 4);
      window.clearInterval(timer);
      timer = window.setInterval(tick, speed);
      placeFood();
    } else {
      snake.pop();
    }

    draw();
  };

  const start = () => {
    if (state === 'over' || state === 'idle') reset();
    state = 'running';
    overlay.hidden = true;
    window.clearInterval(timer);
    timer = window.setInterval(tick, speed);
  };

  const togglePause = () => {
    if (state === 'running') {
      state = 'paused';
      window.clearInterval(timer);
      timer = 0;
      draw();
    } else if (state === 'paused') {
      state = 'running';
      timer = window.setInterval(tick, speed);
    }
  };

  const steer = (x: number, y: number) => {
    const last = queued.length ? queued[queued.length - 1] : dir;
    if (last.x === -x && last.y === -y) return;   // no instant reversal
    if (last.x === x && last.y === y) return;
    if (queued.length < 2) queued.push({ x, y });
    if (state !== 'running') start();
  };

  const KEYS: Record<string, [number, number]> = {
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0]
  };

  const onKey = (event: KeyboardEvent) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

    if (key === ' ' || key === 'p') {
      if (state === 'running' || state === 'paused') {
        event.preventDefault();
        togglePause();
      }
      return;
    }

    const move = KEYS[key];
    if (!move) return;

    // only swallow the scroll while a game is actually in play
    if (state === 'running' || state === 'paused') event.preventDefault();
    steer(move[0], move[1]);
  };

  const pad = root.querySelector('.g-pad') as HTMLElement;
  const onPad = (event: Event) => {
    const button = (event.target as HTMLElement).closest('button');
    if (!button) return;
    const map: Record<string, [number, number]> = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
    const move = map[button.className];
    if (move) steer(move[0], move[1]);
  };

  const restart = root.querySelector('[data-restart]') as HTMLButtonElement;
  const onRestart = () => { state = 'idle'; reset(); start(); };

  window.addEventListener('keydown', onKey);
  pad.addEventListener('click', onPad);
  restart.addEventListener('click', onRestart);

  reset();
  overlay.hidden = false;

  return {
    destroy() {
      window.clearInterval(timer);
      timer = 0;
      window.removeEventListener('keydown', onKey);
      pad.removeEventListener('click', onPad);
      restart.removeEventListener('click', onRestart);
      root.innerHTML = '';
    }
  };
}
