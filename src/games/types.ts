/** Every game returns a handle so the Lab can tear it down when closed. */
export interface GameHandle {
  destroy(): void;
}

export type GameMount = (root: HTMLElement) => GameHandle;

/** Reads a theme colour off the document so games follow the light/dark switch. */
export function token(name: string): string {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

export function store(key: string): number {
  const raw = localStorage.getItem(key);
  const value = raw === null ? NaN : Number(raw);
  return Number.isFinite(value) ? value : 0;
}

export function save(key: string, value: number): void {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    /* private browsing — scores just don't persist */
  }
}
