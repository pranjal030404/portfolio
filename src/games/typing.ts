import { GameHandle, store, save } from './types';

const BEST_KEY = 'portfolio_typing_best_wpm';
const DURATION = 30;

const LINES = [
  'Redis streams decouple ingestion from processing.',
  'TCP devices send frames that must be parsed before storage.',
  'Trackers speak binary, not JSON.',
  'A checksum is cheaper than a corrupted position record.',
  'The parser validates every frame before anything downstream sees it.',
  'MongoDB stores the position history for route playback.',
  'Socket.io pushes updates to the map as they arrive.',
  'A slow consumer should fall behind, not drop packets.',
  'Express routes are thin; the interesting work happens below them.',
  'Geofence alerts fire on the way through the pipeline.'
];

export function mount(root: HTMLElement): GameHandle {
  root.innerHTML = `
    <div class="g">
      <div class="g-board">
        <p class="g-type" data-text aria-hidden="true"></p>
        <label class="visually-hidden" for="typing-input">Type the text shown above</label>
        <input class="g-input" id="typing-input" type="text" autocomplete="off"
               autocapitalize="off" autocorrect="off" spellcheck="false"
               placeholder="Start typing to begin…">
      </div>

      <div class="g-meta">
        <dl class="g-stats">
          <div><dt>WPM</dt><dd data-wpm>0</dd></div>
          <div><dt>Accuracy</dt><dd data-acc>100%</dd></div>
          <div><dt>Time</dt><dd data-time>${DURATION}</dd></div>
          <div><dt>Best</dt><dd data-best>0</dd></div>
        </dl>
        <div class="g-actions">
          <button class="g-btn" type="button" data-restart>Restart</button>
        </div>
      </div>

      <p class="g-hint" data-hint>Thirty seconds. Mistakes count against accuracy.</p>
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
      if (out.length > 150) break;
      out += (out ? ' ' : '') + line;
    }
    return out;
  };

  /**
   * Each character is its own span so the current one can be marked. Spaces
   * stay real spaces — using &nbsp; here makes the whole passage one
   * unbreakable run that overflows instead of wrapping. The container carries
   * white-space: pre-wrap so the spaces survive and lines still break.
   */
  const render = () => {
    const typed = input.value;
    const parts: string[] = [];

    for (let i = 0; i < target.length; i += 1) {
      const char = target[i];
      let cls = '';

      if (i < typed.length) cls = typed[i] === char ? 'ok' : 'bad';
      else if (i === typed.length) cls = 'at';

      parts.push(`<span${cls ? ` class="${cls}"` : ''}>${char === '<' ? '&lt;' : char}</span>`);
    }

    textEl.innerHTML = parts.join('');
  };

  const stats = () => {
    const typed = input.value;
    let correct = 0;
    for (let i = 0; i < typed.length; i += 1) {
      if (typed[i] === target[i]) correct += 1;
    }

    const elapsed = Math.max(1, DURATION - left);
    const wpm = Math.round((correct / 5) / (elapsed / 60));
    const accuracy = typedTotal === 0
      ? 100
      : Math.max(0, Math.round(((typedTotal - errors) / typedTotal) * 100));

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
      hintEl.textContent = `New best — ${wpm} wpm. Restart to try again.`;
    } else {
      hintEl.textContent = `Finished — ${wpm} wpm. Restart to try again.`;
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

    if (typed.length > typedTotal) {
      const index = typed.length - 1;
      typedTotal = typed.length;
      if (typed[index] !== target[index]) errors += 1;
    }

    render();

    if (typed.length >= target.length) {
      finish();
      return;
    }

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
    hintEl.textContent = 'Thirty seconds. Mistakes count against accuracy.';
    render();
  };

  const onRestart = () => { reset(); input.focus(); };

  input.addEventListener('input', onInput);
  restart.addEventListener('click', onRestart);

  reset();
  input.focus();

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
