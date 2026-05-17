import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MATCH_STEPS_SCRUB } from '../constants/matchSteps';
import { invalidateCarouselMeasure } from '../lib/matchStepsCarouselScroll';
import { useMatchStepsCarousel } from '../hooks/useMatchStepsCarousel';

const COLUMN_MAX = 'clamp(168px, 26vw, 320px)';
const PUZZLE_WIDTH = 'clamp(112px, 17.5vw, 220px)';
const LABEL_MIN_HEIGHT = 'clamp(64px, 8.5vw, 108px)';
const LABEL_WIDTH = 'clamp(74%, 78%, 82%)';

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

const CAROUSEL_STYLES = `
  #match-steps.match-steps--collapsed {
    height: 0 !important;
    min-height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    visibility: hidden !important;
  }
  #match-steps.match-steps--viewport-locked {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
    width: 100%;
    margin-top: 0;
    padding-top: clamp(12px, 2vh, 24px);
    padding-bottom: clamp(20px, 3vh, 40px);
    z-index: 44;
    visibility: visible !important;
  }
  .match-steps-track {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .match-steps-track::-webkit-scrollbar {
    display: none;
  }
  .match-steps-track--scrub {
    scroll-snap-type: none !important;
    overflow-x: hidden !important;
  }
  .match-steps-slide {
    flex: 0 0 25%;
    scroll-snap-align: start;
    min-width: 0;
    box-sizing: border-box;
    padding: 0 clamp(6px, 1.25vw, 16px);
  }
  @media (max-width: 900px) {
    .match-steps-slide {
      flex: 0 0 50%;
    }
  }
  @media (max-width: 480px) {
    .match-steps-slide {
      flex: 0 0 100%;
    }
  }
`;

const MatchStepCard = ({ puzzle, bg, label, alt, puzzleRotate = 0 }) => (
  <article
    className="match-step"
    style={{
      position: 'relative',
      width: '100%',
      maxWidth: COLUMN_MAX,
      margin: '0 auto',
      paddingTop: 'clamp(48px, 8vw, 88px)',
    }}
  >
    <img
      src={puzzle}
      alt=""
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        transform: `translateX(-50%) rotate(${puzzleRotate}deg)`,
        width: PUZZLE_WIDTH,
        height: 'auto',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: LABEL_MIN_HEIGHT,
        marginTop: 'clamp(32px, 5vw, 56px)',
      }}
    >
      <img
        src={bg}
        alt=""
        aria-hidden="true"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
        }}
      />
      <img
        src={label}
        alt={alt}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: LABEL_WIDTH,
          height: 'auto',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </div>
  </article>
);

const MatchStepsRow = () => {
  const { viewportRef, trackRef, isScrubbing, onKeyDown } = useMatchStepsCarousel(
    MATCH_STEPS_SCRUB.length,
  );

  useEffect(() => {
    const section = document.getElementById('match-steps');
    if (!section) return undefined;

    const refresh = () => {
      invalidateCarouselMeasure();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    refresh();
    waitForImages(section).then(refresh);
    window.addEventListener('resize', refresh);
    return () => window.removeEventListener('resize', refresh);
  }, []);

  return (
    <section
      id="match-steps"
      aria-label="How we match steps"
      className="relative bg-cream"
      style={{
        marginTop: 0,
        padding: '0 clamp(16px, 4vw, 40px)',
        pointerEvents: 'none',
      }}
    >
      <div
        className="match-steps-carousel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 'min(1440px, 98vw)',
          margin: '0 auto',
          transform: 'translateY(24px)',
        }}
      >
        <div
          ref={viewportRef}
          className="match-steps-viewport"
          data-lenis-prevent
          style={{ overflow: 'hidden', width: '100%' }}
        >
          <div
            ref={trackRef}
            className={`match-steps-track${isScrubbing ? ' match-steps-track--scrub' : ''}`}
            role="region"
            aria-roledescription="carousel"
            aria-label="Matchitt process steps"
            tabIndex={0}
            onKeyDown={onKeyDown}
            style={{
              display: 'flex',
              width: '100%',
              willChange: 'transform',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-x',
            }}
          >
            {MATCH_STEPS_SCRUB.map((step) => (
              <div
                key={step.id}
                className="match-steps-slide"
                aria-hidden={step.id > 4 ? true : undefined}
              >
                <MatchStepCard {...step} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{CAROUSEL_STYLES}</style>
    </section>
  );
};

export default MatchStepsRow;
