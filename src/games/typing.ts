import { GameHandle, store, save } from './types';

const BEST_KEY = 'portfolio_typing_best_wpm';
const DURATION = 30;

const LINES = [
  'Redis streams decouple ingestion from processing.',
  'TCP devices send frames that must be parsed before storage.',
  'Node.js handles the processing pipeline.',
  'A checksum is cheaper than a corrupted position record.',
  'The parser validates every frame before anything downstream sees it.',
  'MongoDB stores the position history for route playback.',
  'Socket.io pushes updates to the map as they arrive.',
  'Trackers speak binary, not JSON.',
  'A slow consumer should fall behind, not drop packets.',
  'Express routes are thin; the interesting work happens below them.'
];

export function mount(root: HTMLElement): GameHandle {
  root.innerHTML = `
    <div class="g">
      <div class="g-board">
        <div class="g-type" data-text aria-hidden="true"></div>
        <label class="visually-hidden" for="typing-input">Type the text shown above</label>
        <input class="g-input" id="typing-input" type="text" autocomplete="off"
               autocapitalize="off" autocorrect="off" spellcheck="false"
               placeholder="Start typing to begin…">
      </div>

      <div class="g-side">
        <div>
          <dl class="g-stat"><dt>WPM</dt><dd data-wpm>0</dd></dl>
          <dl class="g-stat"><dt>Accuracy</dt><dd data-acc>100%</dd></dl>
          <dl class="g-stat"><dt>Time</dt><dd data-time>${DURATION}</dd></dl>
          <dl class="g-stat"><dt>Best</dt><dd data-best>0</dd></dl>
        </div>
        <button class="g-btn" type="button" data-restart>Restart</button>
        <p class="g-hint" data-hint>Thirty seconds.<br>Mistakes count against accuracy.</p>
      </div>
    </div>
  `;

  const textEl = root.querySelector('[data-text]') as HTMLElement;
  const input = root.querySelector('input') as HTMLInputElement;
  const wpmEl = root.querySelector('[data-wpm]') as HTMLElement;
  const accEl = root.querySelector('[data-acc]') as HTMLElement;
  const timeEl = root.querySelector('[data-time]') as HTMLElement;
  const bestEl = root.querySelector('[data-best]') as HTMLElement;
  const hintEl = root.querySelector('[data-hint]') as HTMLElement;
  const restart = root.querySelector('[data-restart]') as HTMLButtonElement;

  let target = '';
  let timer = 0;
  let left = DURATION;
  let started = false;
  let typedTotal = 0;
  let errors = 0;
  let best = store(BEST_KEY);

  bestEl.textContent = String(best);

  const buildText = () => {
    const pool = [...LINES].sort(() => Math.random() - 0.5);
    let out = '';
    for (const line of pool) {
      if (out.length > 190) break;
      out += (out ? ' ' : '') + line;
    }
    return out;
  };

  const render = () => {
    const typed = input.value;
    let html = '';

    for (let i = 0; i < target.length; i += 1) {
      const char = target[i] === ' ' ? '&nbsp;' : target[i];
      if (i < typed.length) {
        html += typed[i] === target[i] ? `<b>${char}</b>` : `<span class="bad">${char}</span>`;
      } else if (i === typed.length) {
        html += `<span class="at">${char}</span>`;
      } else {
        html += `<span>${char}</span>`;
      }
    }

    textEl.innerHTML = html;
  };

  const stats = () => {
    const typed = input.value;
    let correct = 0;
    for (let i = 0; i < typed.length; i += 1) {
      if (typed[i] === target[i]) correct += 1;
    }

    const elapsed = Math.max(1, DURATION - left);
    const wpm = Math.round((correct / 5) / (elapsed / 60));
    const accuracy = typedTotal === 0 ? 100 : Math.max(0, Math.round(((typedTotal - errors) / typedTotal) * 100));

    wpmEl.textContent = String(wpm);
    accEl.textContent = `${accuracy}%`;
    return wpm;
  };

  const finish = () => {
    window.clearInterval(timer);
    timer = 0;
    input.disabled = true;

    const wpm = stats();
    if (wpm > best) {
      best = wpm;
      save(BEST_KEY, best);
      bestEl.textContent = String(best);
      hintEl.innerHTML = `New best — ${wpm} wpm.<br>Restart to try again.`;
    } else {
      hintEl.innerHTML = `Finished — ${wpm} wpm.<br>Restart to try again.`;
    }
  };

  const startClock = () => {
    started = true;
    timer = window.setInterval(() => {
      left -= 1;
      timeEl.textContent = String(Math.max(0, left));
      stats();
      if (left <= 0) finish();
    }, 1000);
  };

  const onInput = () => {
    if (!started) startClock();

    const typed = input.value;

    // count each newly typed character once, so accuracy reflects keystrokes
    if (typed.length > typedTotal) {
      const index = typed.length - 1;
      typedTotal = typed.length;
      if (typed[index] !== target[index]) errors += 1;
    }

    if (typed.length >= target.length) {
      render();
      finish();
      return;
    }

    render();
    stats();
  };

  const reset = () => {
    window.clearInterval(timer);
    timer = 0;
    target = buildText();
    left = DURATION;
    started = false;
    typedTotal = 0;
    errors = 0;
    input.disabled = false;
    input.value = '';
    timeEl.textContent = String(DURATION);
    wpmEl.textContent = '0';
    accEl.textContent = '100%';
    hintEl.innerHTML = 'Thirty seconds.<br>Mistakes count against accuracy.';
    render();
  };

  const onRestart = () => { reset(); input.focus(); };

  input.addEventListener('input', onInput);
  restart.addEventListener('click', onRestart);
  reset();

  return {
    destroy() {
      window.clearInterval(timer);
      timer = 0;
      input.removeEventListener('input', onInput);
      restart.removeEventListener('click', onRestart);
      root.innerHTML = '';
    }
  };
}
