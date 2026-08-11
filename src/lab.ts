import type { GameHandle, GameMount } from './games/types';

/**
 * Games are code-split and only fetched when opened, so the initial page load
 * carries none of them. Opening one mounts it into a single dedicated stage;
 * closing destroys the instance so no loop, timer or listener survives.
 */
const LOADERS: Record<string, () => Promise<{ mount: GameMount }>> = {
  snake: () => import('./games/snake'),
  typing: () => import('./games/typing'),
  reaction: () => import('./games/reaction')
};

const TITLES: Record<string, string> = {
  snake: 'Snake',
  typing: 'Typing',
  reaction: 'Reaction'
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
  let token = 0;

  const close = (returnFocus = true) => {
    token += 1;                        // invalidate any chunk still loading
    live?.destroy();
    live = null;
    body.textContent = '';
    stage.hidden = true;
    buttons.forEach(button => button.setAttribute('aria-expanded', 'false'));

    if (returnFocus) opener?.focus();
    opener = null;
  };

  const open = (name: string, button: HTMLButtonElement) => {
    const load = LOADERS[name];
    if (!load) return;

    close(false);

    const mine = ++token;
    opener = button;
    title.textContent = TITLES[name] ?? name;
    stage.hidden = false;
    button.setAttribute('aria-expanded', 'true');

    body.textContent = '';
    const loading = document.createElement('p');
    loading.className = 'loading';
    loading.setAttribute('role', 'status');
    loading.innerHTML = 'Loading <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>';
    body.append(loading);

    load()
      .then(module => {
        if (mine !== token) return;    // closed or switched while loading
        body.textContent = '';
        live = module.mount(body);

        // a game may claim focus itself (the typing test focuses its input);
        // only fall back to the stage heading if nothing did
        if (!body.contains(document.activeElement)) title.focus();

        stage.scrollIntoView({ block: 'nearest' });
      })
      .catch(() => {
        if (mine !== token) return;
        body.textContent = 'Could not load this one.';
      });
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
