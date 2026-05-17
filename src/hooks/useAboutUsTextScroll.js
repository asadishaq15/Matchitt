import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  applyAboutPuzzleMotion,
  resetAboutPuzzleMotion,
} from '../constants/aboutUsPuzzle';
import { onScrollReady, SCROLL_ROOT } from '../lib/scrollEngine';

gsap.registerPlugin(ScrollTrigger);

const scrollTriggerBase = {
  scroller: SCROLL_ROOT,
  invalidateOnRefresh: true,
};

const DESKTOP_MQ = '(min-width: 769px) and (prefers-reduced-motion: no-preference)';
const FALLBACK_MQ = '(max-width: 768px), (prefers-reduced-motion: reduce)';

const SCRUB_SMOOTHNESS = 2.2;
const END_BUFFER_VH = 0.05;
const RESIZE_DEBOUNCE_MS = 150;

const waitForImages = (container) => {
  const images = container.querySelectorAll('img');
  if (images.length === 0) return Promise.resolve();

  return Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        }),
    ),
  );
};

const getChapterCount = (copyTrack) =>
  copyTrack?.querySelectorAll('.about-us__chapter').length ?? 0;

const getCopyOverflow = (copyTrack, copyViewport) => {
  if (!copyTrack || !copyViewport) return 0;
  return copyTrack.scrollHeight - copyViewport.clientHeight;
};

const getScrollDistance = (copyTrack, copyViewport) => {
  const chapterCount = getChapterCount(copyTrack);
  if (chapterCount <= 1) return window.innerHeight * END_BUFFER_VH;

  const overflow = getCopyOverflow(copyTrack, copyViewport);
  return Math.max(overflow, 0) + window.innerHeight * END_BUFFER_VH;
};

const getStageHeight = (pin, copyViewport) => {
  const pinHeight = pin?.clientHeight ?? 0;
  const viewportHeight = copyViewport?.clientHeight ?? 0;
  return Math.max(pinHeight, viewportHeight, window.innerHeight) || window.innerHeight;
};

const syncChapterHeights = (pin, copyViewport, copyTrack) => {
  const step = getStageHeight(pin, copyViewport);
  if (step <= 0) return;

  copyTrack.querySelectorAll('.about-us__chapter').forEach((chapter) => {
    chapter.style.minHeight = `${step}px`;
    chapter.style.height = `${step}px`;
  });
};

const clearChapterHeights = (copyTrack) => {
  copyTrack.querySelectorAll('.about-us__chapter').forEach((chapter) => {
    chapter.style.minHeight = '';
    chapter.style.height = '';
  });
};

const measureScrollMetrics = (pin, copyViewport, copyTrack) => {
  syncChapterHeights(pin, copyViewport, copyTrack);
  const maxY = Math.max(getCopyOverflow(copyTrack, copyViewport), 0);
  const scrollDistance = getScrollDistance(copyTrack, copyViewport);
  return { maxY, scrollDistance };
};

const setChapterFocus = (copyTrack, progress) => {
  const chapters = copyTrack.querySelectorAll('.about-us__chapter');
  const n = chapters.length;
  if (!n) return;

  const active = gsap.utils.clamp(0, n - 1, Math.round(progress * (n - 1)));

  chapters.forEach((chapter, i) => {
    gsap.set(chapter, { opacity: i === active ? 1 : 0.5 });
  });
};

const applyScrollProgress = (copyTrack, progress, maxY) => {
  gsap.set(copyTrack, {
    y: progress * -maxY,
    force3D: true,
  });
};

const debounce = (fn, ms) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

export const useAboutUsTextScroll = ({
  sectionRef,
  pinRef,
  copyViewportRef,
  copyTrackRef,
  puzzleMotionRef,
}) => {
  useGSAP(
    () => {
      let mm;
      let disposed = false;

      const setup = () => {
        if (disposed) return;

        const section = sectionRef.current;
        const pin = pinRef.current;
        const copyViewport = copyViewportRef.current;
        const copyTrack = copyTrackRef.current;

        if (!section || !pin || !copyViewport || !copyTrack) return;

        mm = gsap.matchMedia();

        mm.add(FALLBACK_MQ, () => {
          clearChapterHeights(copyTrack);
          gsap.set(copyTrack, { y: 0, clearProps: 'transform' });
          gsap.set(copyTrack.querySelectorAll('.about-us__chapter'), {
            opacity: 1,
            clearProps: 'opacity',
          });
        });

        mm.add(DESKTOP_MQ, () => {
          let cachedMaxY = 0;
          let cachedScrollDistance = 0;

          const recomputeMetrics = () => {
            const metrics = measureScrollMetrics(pin, copyViewport, copyTrack);
            cachedMaxY = metrics.maxY;
            cachedScrollDistance = metrics.scrollDistance;
            return metrics;
          };

          const resetToStart = () => {
            gsap.set(copyTrack, { y: 0, force3D: true });
            setChapterFocus(copyTrack, 0);
            resetAboutPuzzleMotion(puzzleMotionRef);
          };

          const clampToEnd = () => {
            applyScrollProgress(copyTrack, 1, cachedMaxY);
            setChapterFocus(copyTrack, 1);
            applyAboutPuzzleMotion(puzzleMotionRef, 1);
          };

          const { maxY } = recomputeMetrics();
          resetToStart();

          if (maxY > 0) {
            ScrollTrigger.create({
              ...scrollTriggerBase,
              id: 'about-us-scroll',
              trigger: pin,
              start: 'top top',
              end: () => `+=${cachedScrollDistance}`,
              pin: true,
              pinSpacing: true,
              scrub: SCRUB_SMOOTHNESS,
              anticipatePin: 0,
              onEnter: resetToStart,
              onEnterBack: resetToStart,
              onLeave: clampToEnd,
              onLeaveBack: resetToStart,
              onUpdate: (self) => {
                applyScrollProgress(copyTrack, self.progress, cachedMaxY);
                setChapterFocus(copyTrack, self.progress);
                applyAboutPuzzleMotion(puzzleMotionRef, self.progress);
              },
            });
          } else {
            gsap.set(copyTrack.querySelectorAll('.about-us__chapter'), { opacity: 1 });
          }

          const refreshAfterLayout = debounce(() => {
            recomputeMetrics();
            requestAnimationFrame(() => ScrollTrigger.refresh());
          }, RESIZE_DEBOUNCE_MS);

          waitForImages(section).then(() => {
            recomputeMetrics();
            requestAnimationFrame(() => ScrollTrigger.refresh());
          });

          window.addEventListener('resize', refreshAfterLayout);
          return () => window.removeEventListener('resize', refreshAfterLayout);
        });
      };

      const unsub = onScrollReady(setup);

      return () => {
        disposed = true;
        unsub();
        mm?.revert();
      };
    },
    { scope: sectionRef, dependencies: [] },
  );
};
