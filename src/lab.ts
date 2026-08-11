import type { GameHandle, GameMount } from './games/types';
import { mount as mountSnake } from './games/snake';
import { mount as mountTyping } from './games/typing';
import { mount as mountReaction } from './games/reaction';
import { mount as mount2048 } from './games/2048';
import { mount as mountMinesweeper } from './games/minesweeper';
import { mount as mountBreakout } from './games/breakout';
import { mount as mountMemory } from './games/memory';

/**
 * Every game is bundled statically — nothing is fetched on demand. Opening
 * one mounts it into a single dedicated stage; closing destroys the instance
 * so no loop, timer or listener survives.
 */
const GAMES: Record<string, { title: string; mount: GameMount }> = {
  snake: { title: 'Snake', mount: mountSnake },
  typing: { title: 'Typing', mount: mountTyping },
  reaction: { title: 'Reaction', mount: mountReaction },
  '2048': { title: '2048', mount: mount2048 },
  minesweeper: { title: 'Minesweeper', mount: mountMinesweeper },
  breakout: { title: 'Breakout', mount: mountBreakout },
  memory: { title: 'Memory', mount: mountMemory }
};

export function initLab(): void {
  const stage = document.getElementById('lab-stage');
  const body = document.getElementById('stage-body');
  const title = document.getElementById('stage-title');
  const closeButton = document.getElementById('stage-close');
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.lab-play'));

  if (!stage || !body || !title || !closeButton || !buttons.length) return;

  let live: GameHandle | null = null;
  let opener: HTMLButtonElement | null = null;

  const close = (returnFocus = true) => {
    live?.destroy();
    live = null;
    body.textContent = '';
    stage.hidden = true;
    buttons.forEach(button => button.setAttribute('aria-expanded', 'false'));

    if (returnFocus) opener?.focus();
    opener = null;
  };

  const open = (name: string, button: HTMLButtonElement) => {
    const game = GAMES[name];
    if (!game) return;

    close(false);

    opener = button;
    title.textContent = game.title;
    stage.hidden = false;
    button.setAttribute('aria-expanded', 'true');

    body.textContent = '';
    live = game.mount(body);

    // a game may claim focus itself (the typing test focuses its input);
    // only fall back to the stage heading if nothing did
    if (!body.contains(document.activeElement)) title.focus();

    stage.scrollIntoView({ block: 'nearest' });
  };

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const name = button.dataset.game ?? '';
      if (opener === button) close();
      else open(name, button);
    });
  });

  closeButton.addEventListener('click', () => close());

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !stage.hidden) close();
  });
}
