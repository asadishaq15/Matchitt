import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onScrollReady, SCROLL_ROOT } from '../lib/scrollEngine';

gsap.registerPlugin(ScrollTrigger);

const scrollTriggerBase = {
  scroller: SCROLL_ROOT,
  invalidateOnRefresh: true,
};

const DESKTOP_MQ = '(min-width: 769px) and (prefers-reduced-motion: no-preference)';
const FALLBACK_MQ = '(max-width: 768px), (prefers-reduced-motion: reduce)';

const SCRUB_SMOOTHNESS = 1.35;
const END_BUFFER_VH = 0.15;

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

const syncChapterHeights = (copyViewport, copyTrack) => {
  const step = copyViewport.clientHeight;
  if (step <= 0) return;

  copyTrack.querySelectorAll('.about-us__chapter').forEach((chapter) => {
    chapter.style.minHeight = `${step}px`;
  });
};

const clearChapterHeights = (copyTrack) => {
  copyTrack.querySelectorAll('.about-us__chapter').forEach((chapter) => {
    chapter.style.minHeight = '';
  });
};

const updateChapterFocus = (copyViewport, copyTrack) => {
  const chapters = copyTrack.querySelectorAll('.about-us__chapter');
  if (!chapters.length) return;

  const viewportRect = copyViewport.getBoundingClientRect();
  const viewportCenter = viewportRect.top + viewportRect.height * 0.5;
  const falloff = viewportRect.height * 0.65;

  chapters.forEach((chapter) => {
    const rect = chapter.getBoundingClientRect();
    const chapterCenter = rect.top + rect.height * 0.5;
    const dist = Math.abs(chapterCenter - viewportCenter);
    const opacity = gsap.utils.clamp(0.32, 1, 1 - dist / falloff);
    gsap.set(chapter, { opacity });
  });
};

export const useAboutUsTextScroll = ({
  sectionRef,
  pinRef,
  copyViewportRef,
  copyTrackRef,
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
          syncChapterHeights(copyViewport, copyTrack);
          gsap.set(copyTrack, { y: 0 });

          const measureOverflow = () => getCopyOverflow(copyTrack, copyViewport);
          const scrollY = () => -Math.max(measureOverflow(), 0);

          if (measureOverflow() > 0) {
            gsap.set(copyTrack.querySelectorAll('.about-us__chapter'), { opacity: 0.32 });

            gsap.timeline({
              scrollTrigger: {
                ...scrollTriggerBase,
                trigger: pin,
                start: 'top top',
                end: () => `+=${getScrollDistance(copyTrack, copyViewport)}`,
                pin: true,
                pinSpacing: true,
                scrub: SCRUB_SMOOTHNESS,
                anticipatePin: 1,
                fastScrollEnd: true,
                onUpdate: () => updateChapterFocus(copyViewport, copyTrack),
              },
            }).to(copyTrack, {
              y: scrollY,
              ease: 'none',
              force3D: true,
            });

            updateChapterFocus(copyViewport, copyTrack);
          } else {
            gsap.set(copyTrack.querySelectorAll('.about-us__chapter'), { opacity: 1 });
          }

          const refreshAfterLayout = () => {
            syncChapterHeights(copyViewport, copyTrack);
            requestAnimationFrame(() => ScrollTrigger.refresh());
          };

          waitForImages(section).then(refreshAfterLayout);
          refreshAfterLayout();

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
