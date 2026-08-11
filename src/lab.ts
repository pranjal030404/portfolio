import type { GameHandle, GameMount } from './games/types';

/**
 * Games are code-split and only fetched when their panel is opened. Closing a
 * panel destroys the instance, so nothing keeps a loop or timer running in the
 * background.
 */
const LOADERS: Record<string, () => Promise<{ mount: GameMount }>> = {
  snake: () => import('./games/snake'),
  typing: () => import('./games/typing'),
  reaction: () => import('./games/reaction')
};

export function initLab(): void {
  const panels = Array.from(
    document.querySelectorAll<HTMLDetailsElement>('.lab-list details[data-game]')
  );
  if (!panels.length) return;

  const live = new Map<HTMLDetailsElement, GameHandle>();

  const close = (panel: HTMLDetailsElement) => {
    const handle = live.get(panel);
    if (!handle) return;
    handle.destroy();
    live.delete(panel);
  };

  panels.forEach(panel => {
    const stage = panel.querySelector<HTMLElement>('[data-mount]');
    const name = panel.dataset.game ?? '';
    const load = LOADERS[name];
    if (!stage || !load) return;

    panel.addEventListener('toggle', () => {
      if (!panel.open) {
        close(panel);
        return;
      }

      // one game at a time
      panels.forEach(other => {
        if (other !== panel && other.open) other.open = false;
      });

      if (live.has(panel)) return;

      stage.textContent = '';
      load()
        .then(module => {
          // the panel may have been closed again while the chunk was loading
          if (!panel.open) return;
          live.set(panel, module.mount(stage));
        })
        .catch(() => {
          stage.innerHTML = '<p class="lab-fallback">Could not load this one.</p>';
        });
    });
  });
}
