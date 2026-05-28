import { useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { currentPathAtom, pushPath } from '@atom/currentPathAtom';

export function usePublicNavigate() {
  const setCurrentPath = useSetAtom(currentPathAtom);

  return useCallback((url: string) => {
    if (typeof window === 'undefined') return;

    if (url.startsWith('/') && !url.startsWith('/admin') && url !== '/login') {
      pushPath(url, setCurrentPath);
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return;
    }

    window.location.href = url;
  }, [setCurrentPath]);
}
