import { useState, useEffect, useCallback } from 'react';

export const useRouterPathIndex = (routes, history) => {
  const [viewpathIndex, setviewpathIndex] = useState(null);
  const getRouterPathIndex = useCallback(() => {
    const pathOnLoad = history.location.pathname;
    const initpathIndex = routes.findIndex(
      (route) => route.path === pathOnLoad
    );
    return initpathIndex === -1 ? 0 : initpathIndex;
  }, []);
  useEffect(() => {
    if (viewpathIndex === null) setviewpathIndex(getRouterPathIndex);
    if (history.action === 'POP') {
      setviewpathIndex(getRouterPathIndex);
    }
  }, [history.location]);

  return [viewpathIndex, setviewpathIndex];
};
