import { useEffect } from 'react';

export default function useDebouncedEffect(effect, dependencies, delay = 500) {
  useEffect(() => {
    const timer = window.setTimeout(effect, delay);
    return () => window.clearTimeout(timer);
    // dependencies are intentionally controlled by the caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, delay]);
}
