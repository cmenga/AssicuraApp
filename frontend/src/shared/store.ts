import type { AxiosInstance, AxiosRequestConfig } from "axios";

type Listener = () => void;

class Store {
  private state: Map<string, any> = new Map();
  private listeners: Map<string, Set<Listener>> = new Map();

  get<T>(key: string): T | undefined {
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

  token = {
    set<T>(key: string, value: T) {
      //Da inserire il salvataggio per il token
      sessionStorage.setItem(key, JSON.stringify(value));
    },
    get<T>(key: string): T | undefined {
      const token = sessionStorage.getItem(key);
      if (!token) return undefined;
      return JSON.parse(token);
    },
    dispatch<T>(key: string, updater: (prev: T | undefined) => T) {
      const token = sessionStorage.getItem(key);
      const prev = token ? JSON.parse(token) : undefined;
      sessionStorage.setItem(key, JSON.stringify(updater(prev)));
    }
  };

}


export const store = new Store();


export async function storeFetchThrow<T>(key: string, service: AxiosInstance, url: string, config?: AxiosRequestConfig) {
  if (store.get<T>(key)) return;

  const response = await service.get<T>(url, config);
  if (response.status == 404) {
    throw new Error("Utente non trovato");
  }
    store.set<T>(key, response.data);
}

export async function storeFetch<T>(key: string, service: AxiosInstance, url: string, config?: AxiosRequestConfig) {
  if (store.get<T>(key)) return;

  const response = await service.get(url, config);
  if (response.status == 404) {
    return undefined;
  }
  store.set<T>(key, response.data);
};