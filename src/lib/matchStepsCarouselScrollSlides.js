export const getSlidesPerView = () => {
  if (window.matchMedia('(max-width: 480px)').matches) return 1;
  if (window.matchMedia('(max-width: 900px)').matches) return 2;
  return 4;
};

/** Match-steps carousel: fewer per view so scroll reveals more card groups. */
export const getMatchStepsSlidesPerView = () => {
  if (window.matchMedia('(max-width: 480px)').matches) return 1;
  return 2;
};
