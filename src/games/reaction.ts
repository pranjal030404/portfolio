import { GameHandle, store, save } from './types';

const BEST_KEY = 'portfolio_reaction_best';

export function mount(root: HTMLElement): GameHandle {
  root.innerHTML = `
    <div class="g">
      <div class="g-board">
        <button class="g-target" type="button" data-target>
          <span class="g-target-head" data-headline>Ready</span>
          <span class="g-target-note" data-note>Click to start, then wait</span>
        </button>
      </div>

      <div class="g-meta">
        <dl class="g-stats">
          <div><dt>Last</dt><dd data-last>—</dd></div>
          <div><dt>Best</dt><dd data-best>—</dd></div>
          <div><dt>Attempts</dt><dd data-count>0</dd></div>
        </dl>
        <div class="g-actions">
          <button class="g-btn" type="button" data-reset>Clear best</button>
        </div>
      </div>

      <p class="g-hint">Wait for the panel to change, then hit it as fast as you can.</p>
    </div>
  `;

  const target = root.querySelector('[data-target]') as HTMLButtonElement;
  const headline = root.querySelector('[data-headline]') as HTMLElement;
  const note = root.querySelector('[data-note]') as HTMLElement;
  const lastEl = root.querySelector('[data-last]') as HTMLElement;
  const bestEl = root.querySelector('[data-best]') as HTMLElement;
  const countEl = root.querySelector('[data-count]') as HTMLElement;
  const resetBtn = root.querySelector('[data-reset]') as HTMLButtonElement;

  let state: 'idle' | 'waiting' | 'armed' | 'result' = 'idle';
  let armTimer = 0;
  let armedAt = 0;
  let attempts = 0;
  let best = store(BEST_KEY);

  if (best > 0) bestEl.textContent = `${best} ms`;

  const arm = () => {
    state = 'armed';
    armedAt = performance.now();
    target.classList.add('armed');
    headline.textContent = 'Now';
    note.textContent = 'Hit it';
  };

  const wait = () => {
    state = 'waiting';
    target.classList.remove('armed');
    headline.textContent = 'Wait';
    note.textContent = 'Not yet…';
    armTimer = window.setTimeout(arm, 1200 + Math.random() * 2800);
  };

  const tooSoon = () => {
    window.clearTimeout(armTimer);
    armTimer = 0;
    state = 'result';
    target.classList.remove('armed');
    headline.textContent = 'Too soon';
    note.textContent = 'Click to go again';
  };

  const score = () => {
    const time = Math.round(performance.now() - armedAt);
    state = 'result';
    target.classList.remove('armed');

    attempts += 1;
    countEl.textContent = String(attempts);
    lastEl.textContent = `${time} ms`;
    headline.textContent = `${time} ms`;

    if (best === 0 || time < best) {
      best = time;
      save(BEST_KEY, best);
      bestEl.textContent = `${time} ms`;
      note.textContent = 'Best so far — click to go again';
    } else {
      note.textContent = 'Click to go again';
    }
  };

  const hit = () => {
    if (state === 'idle' || state === 'result') wait();
    else if (state === 'waiting') tooSoon();
    else if (state === 'armed') score();
  };

  const onClick = () => hit();

  const onReset = () => {
    best = 0;
    attempts = 0;
    save(BEST_KEY, 0);
    bestEl.textContent = '—';
    lastEl.textContent = '—';
    countEl.textContent = '0';
  };

  target.addEventListener('click', onClick);
  resetBtn.addEventListener('click', onReset);

  return {
    destroy() {
      window.clearTimeout(armTimer);
      armTimer = 0;
      target.removeEventListener('click', onClick);
      resetBtn.removeEventListener('click', onReset);
      root.innerHTML = '';
    }
  };
}
