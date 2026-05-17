import { useEffect } from 'react';
import { initScrollEngine } from '../lib/scrollEngine';

export { SCROLL_ROOT, onScrollReady, getLenis, isScrollReady } from '../lib/scrollEngine';

/** Ensures Lenis is running (also initialized in main.jsx before first paint). */
export const useSmoothScroll = () => {
  useEffect(() => {
    initScrollEngine();
  }, []);
};
