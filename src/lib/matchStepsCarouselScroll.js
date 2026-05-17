import gsap from 'gsap';
import { getSlidesPerView } from './matchStepsCarouselScrollSlides';

export {
  getMatchStepsSlidesPerView,
  getSlidesPerView,
} from './matchStepsCarouselScrollSlides';

export const MATCH_STEPS_TRACK_SELECTOR = '#match-steps .match-steps-track';

let cachedMaxOffset = 0;
let lastViewportWidth = 0;
let lastAppliedProgress = -1;

export const getMatchStepsTrack = () => document.querySelector(MATCH_STEPS_TRACK_SELECTOR);

const isTrackMeasurable = (track) => {
  if (!track) return false;
  const section = document.getElementById('match-steps');
  if (!section) return false;
  const opacity = Number(gsap.getProperty(section, 'opacity') ?? 0);
  return opacity > 0.01;
};

/** Measure and cache max horizontal travel (px). */
export const measureCarousel = (track) => {
  if (!track || !isTrackMeasurable(track)) return cachedMaxOffset;

  const viewport = track.parentElement;
  const viewportWidth = viewport?.clientWidth ?? 0;
  if (viewportWidth <= 0) return cachedMaxOffset;

  const slides = track.querySelectorAll('.match-steps-slide');
  if (!slides.length) return cachedMaxOffset;

  if (viewportWidth === lastViewportWidth && cachedMaxOffset > 0) {
    return cachedMaxOffset;
  }

  const totalSlideWidth = Array.from(slides).reduce(
    (sum, slide) => sum + slide.offsetWidth,
    0,
  );
  const layoutMax = Math.max(0, totalSlideWidth - viewportWidth);

  const perView = getSlidesPerView();
  const maxPages = Math.max(0, Math.ceil(slides.length / perView) - 1);
  const pageMax = maxPages * viewportWidth;

  cachedMaxOffset =
    pageMax > 0 && layoutMax > 0 ? Math.min(layoutMax, pageMax) : layoutMax;
  lastViewportWidth = viewportWidth;
  return cachedMaxOffset;
};

export const invalidateCarouselMeasure = () => {
  cachedMaxOffset = 0;
  lastViewportWidth = 0;
  lastAppliedProgress = -1;
};

/** Max horizontal travel for the carousel track (px). */
export const getCarouselMaxOffset = (track) => measureCarousel(track);

export const getCarouselProgress = (track) => {
  if (!track) return 0;
  const max = measureCarousel(track);
  if (max <= 0) return 0;
  const x = gsap.getProperty(track, 'x');
  return gsap.utils.clamp(0, 1, Math.abs(Number(x)) / max);
};

export const setCarouselProgress = (track, progress) => {
  if (!track) return;

  const t = gsap.utils.clamp(0, 1, progress);
  if (Math.abs(t - lastAppliedProgress) < 0.0005) return;

  const max = measureCarousel(track);
  lastAppliedProgress = t;
  gsap.set(track, { x: max > 0 ? -t * max : 0, force3D: true });
};

export const resetMatchStepsCarousel = () => {
  const track = getMatchStepsTrack();
  invalidateCarouselMeasure();
  if (!track) return;
  gsap.set(track, { x: 0 });
  track.classList.remove('match-steps-track--scrub');
};

/** @deprecated Use getCarouselMaxOffset */
export const getMaxScroll = (track) => getCarouselMaxOffset(track);

/** @deprecated Use setCarouselProgress */
export const setScrollProgress = (track, progress) => setCarouselProgress(track, progress);

/** @deprecated Use resetMatchStepsCarousel */
export const resetMatchStepsScroll = () => resetMatchStepsCarousel();
