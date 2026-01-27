import { useEffect, useState } from "react";
import { store } from "../store";

export function useStoreKey<T>(key: string): T | undefined {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(key, () => setTick(t => t + 1));
    return () => {
      unsubscribe();
    };
  }, [key]);
  
  return store.get<T>(key);
}

export function useStoreKeyOrThrow<T>(key: string): T {
  const value = useStoreKey<T>(key);
  if (value === undefined) {
    throw new Error(`Store key "${key}" not found`);
  }
  return value;
}