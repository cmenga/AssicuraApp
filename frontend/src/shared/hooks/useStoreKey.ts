import { useEffect, useState } from "react";
import { store } from "../model/store";

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