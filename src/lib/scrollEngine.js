import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const SCROLL_ROOT = document.documentElement;

let lenis = null;
let rafId = null;
let ready = false;
const readyListeners = new Set();

function notifyReady() {
  ready = true;
  readyListeners.forEach((fn) => fn(lenis));
  readyListeners.clear();
}

/** Run callback after Lenis + ScrollTrigger proxy exist (sync if already ready). */
export function onScrollReady(fn) {
  if (ready) {
    queueMicrotask(() => fn(lenis));
  } else {
    readyListeners.add(fn);
  }
  return () => readyListeners.delete(fn);
}

export function getLenis() {
  return lenis;
}

export function isScrollReady() {
  return ready;
}

export function initScrollEngine() {
  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  ScrollTrigger.defaults({
    scroller: SCROLL_ROOT,
  });

  lenis.on('scroll', ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(SCROLL_ROOT, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: 'fixed',
  });

  const onStRefresh = () => {
    lenis.resize();
  };
  ScrollTrigger.addEventListener('refresh', onStRefresh);

  function raf(time) {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    notifyReady();
  });

  return lenis;
}

export function destroyScrollEngine() {
  if (!lenis) return;
  cancelAnimationFrame(rafId);
  lenis.destroy();
  lenis = null;
  ready = false;
  ScrollTrigger.scrollerProxy(SCROLL_ROOT, null);
  ScrollTrigger.defaults({ scroller: undefined });
  ScrollTrigger.getAll().forEach((st) => st.kill());
}
