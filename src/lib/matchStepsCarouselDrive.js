/** True while puzzle-join pin is scrubbing carousel horizontally. */
let drivenByScroll = false;

/** True during pin carousel scrub only (0.58–0.88); false during tilt. */
let carouselScrubPhase = false;

export const setDrivenByScroll = (value) => {
  drivenByScroll = value;
};

export const isDrivenByScroll = () => drivenByScroll;

export const setCarouselScrubPhase = (value) => {
  carouselScrubPhase = value;
};

export const isCarouselScrubPhase = () => carouselScrubPhase;
