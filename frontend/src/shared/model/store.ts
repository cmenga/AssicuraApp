type Listener = () => void;

class Store {
  private state: Map<string, any> = new Map();
  private listeners: Map<string, Set<Listener>> = new Map();

  get<T>(key: string): T | undefined{
    return this.state.get(key);
  }

  set<T>(key: string, value: T) {
    this.state.set(key, value);

    const keyListeners = this.listeners.get(key);
    if (keyListeners) keyListeners.forEach(fn => fn());
  }

  dispatch<T>(key: string, updater: (prev: T | undefined) => T) {
    const prev = this.state.get(key);
    const newValue = updater(prev);
    this.set(key, newValue);
  }
  async asyncdispatch<T>(key: string, updater: (prev: T | undefined) => Promise<T>): Promise<void> {
    const prev = this.state.get(key);
    const newValue = await updater(prev);
    this.set(key, newValue);
  }
  subscribe(key: string, fn: Listener) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }

    const keyListeners = this.listeners.get(key);
    keyListeners?.add(fn);

    return () => keyListeners?.delete(fn);
  }
}


export const store = new Store()