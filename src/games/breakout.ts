import { GameHandle, token, store, save } from './types';

const W = 720;
const H = 480;
const COLS = 9;
const ROWS = 5;
const BEST_KEY = 'portfolio_breakout_high_score';

type State = 'ready' | 'playing' | 'paused' | 'gameover';
interface Brick { x: number; y: number; alive: boolean; }

export function mount(root: HTMLElement): GameHandle {
  root.innerHTML = `
    <div class="g">
      <div class="g-board">
        <canvas class="g-canvas" width="${W}" height="${H}"
                role="img" aria-label="Breakout game board"></canvas>
        <div class="g-over" data-over>
          <strong data-over-title></strong>
          <p data-over-note></p>
          <button class="g-btn" type="button" data-over-action hidden></button>
        </div>
      </div>

      <div class="g-meta">
        <dl class="g-stats">
          <div><dt>Score</dt><dd data-score>0</dd></div>
          <div><dt>Lives</dt><dd data-lives>3</dd></div>
          <div><dt>Level</dt><dd data-level>1</dd></div>
          <div><dt>Best</dt><dd data-best>0</dd></div>
        </dl>
        <div class="g-actions">
          <button class="g-btn" type="button" data-restart>Restart</button>
          <button class="g-btn" type="button" data-pause>Pause</button>
        </div>
      </div>

      <p class="g-hint">Arrow keys or A / D · drag on touch · Space to pause</p>
    </div>
  `;

  const canvas = root.querySelector('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const overlay = root.querySelector('[data-over]') as HTMLElement;
  const overTitle = root.querySelector('[data-over-title]') as HTMLElement;
  const overNote = root.querySelector('[data-over-note]') as HTMLElement;
  const overAction = root.querySelector('[data-over-action]') as HTMLButtonElement;
  const scoreEl = root.querySelector('[data-score]') as HTMLElement;
  const livesEl = root.querySelector('[data-lives]') as HTMLElement;
  const levelEl = root.querySelector('[data-level]') as HTMLElement;
  const bestEl = root.querySelector('[data-best]') as HTMLElement;
  const restartBtn = root.querySelector('[data-restart]') as HTMLButtonElement;
  const pauseBtn = root.querySelector('[data-pause]') as HTMLButtonElement;

  const PAD_W = 110;
  const PAD_H = 12;
  const R = 8;

  let state: State = 'ready';
  let frame = 0;
  let bricks: Brick[] = [];
  let padX = (W - PAD_W) / 2;
  let ballX = W / 2;
  let ballY = H - 60;
  let vx = 4;
  let vy = -4;
  let score = 0;
  let lives = 3;
  let level = 1;
  let best = store(BEST_KEY);
  let left = false;
  let right = false;

  bestEl.textContent = String(best);

  const BRICK_W = Math.floor((W - 60) / COLS);
  const BRICK_H = 20;

  const buildBricks = () => {
    bricks = [];
    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        bricks.push({ x: 30 + c * BRICK_W, y: 50 + r * (BRICK_H + 8), alive: true });
      }
    }
  };

  const draw = () => {
    const bg = token('--sunk');
    const ink = token('--text');
    const accent = token('--accent');
    const line = token('--border');

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    bricks.forEach((brick, i) => {
      if (!brick.alive) return;
      const row = Math.floor(i / COLS);
      ctx.fillStyle = row === 0 ? accent : ink;
      ctx.globalAlpha = row === 0 ? 1 : Math.max(0.35, 0.85 - row * 0.14);
      ctx.fillRect(brick.x + 1, brick.y, BRICK_W - 6, BRICK_H);
    });
    ctx.globalAlpha = 1;

    ctx.fillStyle = accent;
    ctx.fillRect(padX, H - 28, PAD_W, PAD_H);

    ctx.beginPath();
    ctx.arc(ballX, ballY, R, 0, Math.PI * 2);
    ctx.fillStyle = ink;
    ctx.fill();

    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
  };

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
        overTitle.textContent = lives > 0 ? 'Cleared' : 'Game over';
        overNote.textContent = `Score ${score}`;
        overAction.textContent = 'Restart';
        overAction.hidden = false;
      }
    }

    pauseBtn.disabled = state !== 'playing' && state !== 'paused';
    pauseBtn.textContent = state === 'paused' ? 'Resume' : 'Pause';
  };

  const stopLoop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };

  const resetBall = () => {
    ballX = W / 2;
    ballY = H - 60;
    vx = 4 * (Math.random() > 0.5 ? 1 : -1);
    vy = -4;
    padX = (W - PAD_W) / 2;
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

  const nextLevel = () => {
    level += 1;
    levelEl.textContent = String(level);
    buildBricks();
    resetBall();
    vx *= 1.1;
    vy *= 1.1;
  };

  const step = () => {
    if (left) padX -= 8;
    if (right) padX += 8;
    padX = Math.max(0, Math.min(W - PAD_W, padX));

    ballX += vx;
    ballY += vy;

    if (ballX < R || ballX > W - R) vx = -vx;
    if (ballY < R) vy = -vy;

    // paddle
    if (ballY > H - 28 - R && ballY < H - 28 + PAD_H && ballX > padX && ballX < padX + PAD_W && vy > 0) {
      vy = -Math.abs(vy);
      const hit = (ballX - (padX + PAD_W / 2)) / (PAD_W / 2);
      vx = Math.max(-7, Math.min(7, vx + hit * 2.5));
    }

    // bricks
    for (const brick of bricks) {
      if (!brick.alive) continue;
      if (ballX > brick.x && ballX < brick.x + BRICK_W - 6 && ballY > brick.y && ballY < brick.y + BRICK_H) {
        brick.alive = false;
        vy = -vy;
        score += 10;
        scoreEl.textContent = String(score);
        break;
      }
    }

    if (!bricks.some(b => b.alive)) {
      if (level >= 3) return toGameOver();
      nextLevel();
    }

    // lost the ball
    if (ballY > H + R) {
      lives -= 1;
      livesEl.textContent = String(Math.max(0, lives));
      if (lives <= 0) return toGameOver();
      resetBall();
      state = 'ready';
      render();
      return;
    }

    draw();
    frame = requestAnimationFrame(step);
  };

  const toPlaying = () => {
    if (state === 'playing') return;
    state = 'playing';
    render();
    stopLoop();
    frame = requestAnimationFrame(step);
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

  const reset = () => {
    stopLoop();
    state = 'ready';
    score = 0;
    lives = 3;
    level = 1;
    scoreEl.textContent = '0';
    livesEl.textContent = '3';
    levelEl.textContent = '1';
    buildBricks();
    resetBall();
    render();
  };

  const onKey = (event: KeyboardEvent) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

    if (key === ' ' || key === 'p') {
      if (state === 'playing' || state === 'paused') { event.preventDefault(); togglePause(); }
      return;
    }

    const isLeft = key === 'ArrowLeft' || key === 'a';
    const isRight = key === 'ArrowRight' || key === 'd';
    if (!isLeft && !isRight) return;

    if (state === 'ready' || state === 'playing') event.preventDefault();
    if (isLeft) left = true;
    if (isRight) right = true;
    if (state === 'ready') toPlaying();
  };

  const onKeyUp = (event: KeyboardEvent) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (key === 'ArrowLeft' || key === 'a') left = false;
    if (key === 'ArrowRight' || key === 'd') right = false;
  };

  const movePaddleTo = (clientX: number) => {
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (W / rect.width);
    padX = Math.max(0, Math.min(W - PAD_W, x - PAD_W / 2));
    if (state === 'ready') toPlaying();
    else if (state !== 'playing') draw();
  };

  let dragging = false;
  const onPointerDown = (event: PointerEvent) => { dragging = true; movePaddleTo(event.clientX); };
  const onPointerMove = (event: PointerEvent) => { if (dragging) movePaddleTo(event.clientX); };
  const onPointerUp = () => { dragging = false; };

  window.addEventListener('keydown', onKey);
  window.addEventListener('keyup', onKeyUp);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  restartBtn.addEventListener('click', reset);
  overAction.addEventListener('click', reset);
  pauseBtn.addEventListener('click', togglePause);

  reset();

  return {
    destroy() {
      stopLoop();
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      restartBtn.removeEventListener('click', reset);
      overAction.removeEventListener('click', reset);
      pauseBtn.removeEventListener('click', togglePause);
      root.innerHTML = '';
    }
  };
}
