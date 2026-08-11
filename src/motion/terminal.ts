import { motionOn } from './prefs';

/**
 * The two code blocks.
 *
 * The terminal types itself out when it first comes into view; the source
 * listing walks a highlight down its lines. In both cases the finished text
 * is in the markup, and script removes it before replaying it — so with
 * script off, or with motion off, the blocks simply read as what they are.
 */

/* ──────────────────────────────────────────────────────── terminal ── */

type Line = { kind: string; text: string };

export function initTerminal(): void {
  const body = document.getElementById('term-body');
  if (!body) return;

  const lines: Line[] = Array.from(body.querySelectorAll('p')).map(p => ({
    kind: p.className,
    text: p.textContent ?? ''
  }));

  if (!lines.length || !motionOn() || !('IntersectionObserver' in window)) return;

  body.textContent = '';

  let started = false;

  const play = () => {
    if (started) return;
    started = true;

    let index = 0;

    const nextLine = () => {
      if (index >= lines.length) {
        const caret = document.createElement('span');
        caret.className = 'caret';
        body.append(caret);
        return;
      }

      const line = lines[index];
      const p = document.createElement('p');
      p.className = line.kind;
      body.append(p);

      // commands are typed a character at a time; output arrives whole,
      // the way it actually does in a terminal
      if (line.kind !== 'cmd') {
        p.textContent = line.text;
        index += 1;
        window.setTimeout(nextLine, 260);
        return;
      }

      let cut = 0;
      const type = () => {
        cut += 1;
        p.textContent = line.text.slice(0, cut);

        if (cut < line.text.length) window.setTimeout(type, 45);
        else { index += 1; window.setTimeout(nextLine, 420); }
      };

      type();
    };

    window.setTimeout(nextLine, 300);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      play();
      observer.disconnect();
    });
  }, { threshold: 0.4 });

  observer.observe(body);
}

/* ─────────────────────────────────────────────────── source listing ── */

export function initSnippet(): void {
  const body = document.getElementById('snippet-body');
  if (!body) return;

  const lines = Array.from(body.querySelectorAll<HTMLElement>('.cl'));
  if (!lines.length || !motionOn() || !('IntersectionObserver' in window)) return;

  let timer = 0;
  let at = 0;

  const step = () => {
    lines.forEach((line, i) => line.classList.toggle('lit', i === at));
    at = (at + 1) % lines.length;
    timer = window.setTimeout(step, at === 0 ? 1400 : 420);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !timer) step();
      else if (!entry.isIntersecting && timer) {
        window.clearTimeout(timer);
        timer = 0;
        lines.forEach(line => line.classList.remove('lit'));
      }
    });
  }, { threshold: 0.3 });

  observer.observe(body);
}
