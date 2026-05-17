import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  getCarouselMaxOffset,
  getCarouselProgress,
  getMatchStepsSlidesPerView,
} from '../lib/matchStepsCarouselScroll';

const SCROLL_EDGE = 4;

const useTransformCarousel = () =>
  window.matchMedia('(min-width: 769px)').matches;

export const useMatchStepsCarousel = (slideCount) => {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const getPageWidth = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    return viewport?.clientWidth || track?.clientWidth || 0;
  }, []);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track) return;

    const perView = getMatchStepsSlidesPerView();
    const pages = Math.max(1, Math.ceil(slideCount / perView));
    setPageCount(pages);

    const maxOffset = getCarouselMaxOffset(track);
    const useTransform = useTransformCarousel();

    let progress = 0;
    if (useTransform && maxOffset > 0) {
      progress = getCarouselProgress(track);
    } else {
      const { scrollLeft, scrollWidth, clientWidth } = track;
      progress = clientWidth > 0 ? scrollLeft / Math.max(scrollWidth - clientWidth, 1) : 0;
    }

    setCanPrev(progress > 0.02);
    setCanNext(progress < 0.98);

    const pageWidth = getPageWidth();
    const page =
      pageWidth > 0
        ? Math.round((progress * maxOffset) / pageWidth)
        : Math.round(progress * (pages - 1));
    setActivePage(Math.min(Math.max(0, page), pages - 1));
    setIsScrubbing(track.classList.contains('match-steps-track--scrub'));
  }, [slideCount, getPageWidth]);

  const scrollToOffset = useCallback(
    (offset, smooth = true) => {
      const track = trackRef.current;
      if (!track) return;

      const max = getCarouselMaxOffset(track);
      const clamped = gsap.utils.clamp(0, max, offset);

      if (useTransformCarousel()) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (smooth && !reducedMotion) {
          gsap.to(track, {
            x: -clamped,
            duration: 0.45,
            ease: 'power2.out',
            force3D: true,
            onUpdate: updateScrollState,
            onComplete: updateScrollState,
          });
        } else {
          gsap.set(track, { x: -clamped, force3D: true });
          updateScrollState();
        }
        return;
      }

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollTo({
        left: clamped,
        behavior: smooth && !reducedMotion ? 'smooth' : 'auto',
      });
    },
    [updateScrollState],
  );

  const scrollByPage = useCallback(
    (delta) => {
      const track = trackRef.current;
      if (!track) return;
      const pageWidth = getPageWidth();
      const max = getCarouselMaxOffset(track);
      const current =
        useTransformCarousel() && max > 0
          ? getCarouselProgress(track) * max
          : track.scrollLeft;
      scrollToOffset(current + delta * pageWidth, true);
    },
    [getPageWidth, scrollToOffset],
  );

  const scrollToPage = useCallback(
    (pageIndex) => {
      scrollToOffset(pageIndex * getPageWidth(), true);
    },
    [getPageWidth, scrollToOffset],
  );

  const resetScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    gsap.set(track, { x: 0, clearProps: 'transform' });
    track.scrollLeft = 0;
    track.classList.remove('match-steps-track--scrub');
    updateScrollState();
  }, [updateScrollState]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollByPage(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollByPage(1);
      }
    },
    [scrollByPage],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => updateScrollState();

    updateScrollState();
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateScrollState);
    window.addEventListener('match-steps-carousel-scrub', updateScrollState);

    const ro = new ResizeObserver(updateScrollState);
    ro.observe(track);
    if (viewportRef.current) ro.observe(viewportRef.current);

    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateScrollState);
      window.removeEventListener('match-steps-carousel-scrub', updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  return {
    viewportRef,
    trackRef,
    canPrev,
    canNext,
    activePage,
    pageCount,
    isScrubbing,
    scrollByPage,
    scrollToPage,
    resetScroll,
    onKeyDown,
  };
};
