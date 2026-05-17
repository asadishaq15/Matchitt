import { useRef } from 'react';
import { ABOUT_PUZZLE_MOTION_INITIAL } from '../constants/aboutUsPuzzle';
import AboutUsPuzzleBackground from './AboutUsPuzzleBackground';
import { useAboutUsTextScroll } from '../hooks/useAboutUsTextScroll';

const TITLE_SRC = '/AboutUs/AboutUsTitle.png';
const STARS_SRC = '/AboutUs/AboutUsStars.png';
const ELECTRIC_SRC = '/AboutUs/AboutUsElectric.png';
const CURSOR_SRC = '/AboutUs/AboutUsCursor.png';

const ABOUT_CHAPTERS = [
  {
    id: 'noise',
    heading: 'THE NOISE',
    body: 'There\'s too much content online, too many trends to chase, and too many agencies selling volume instead of clarity. Most businesses don\'t need more posts—they need the right direction toward the audience that will actually listen.',
  },
  {
    id: 'belief',
    heading: 'OUR BELIEF',
    body: 'We started Matchitt with one simple belief: say less, mean more, and reach the people who matter. When your message is clear, every piece of creative, content, and media works harder for you.',
  },
  {
    id: 'match',
    heading: 'HOW WE MATCH',
    body: 'Strategy comes first. Then creative, content, and paid amplification—all built around one consistent voice and one clear plan. We match your brand story to the audiences ready to hear it, through the channels that fit.',
  },
  {
    id: 'results',
    heading: 'WHAT YOU GET',
    body: 'No generic playbooks and no vanity metrics. You get measurable work that connects—and a partner focused on matching you with your audience through strategy, content, and execution that lasts.',
  },
];

const SIDE_INSET = 'clamp(24px, 6vw, 96px)';

const AboutUs = () => {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const copyViewportRef = useRef(null);
  const copyTrackRef = useRef(null);
  const aboutPuzzleMotionRef = useRef({ ...ABOUT_PUZZLE_MOTION_INITIAL });

  useAboutUsTextScroll({
    sectionRef,
    pinRef,
    copyViewportRef,
    copyTrackRef,
    puzzleMotionRef: aboutPuzzleMotionRef,
  });

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-us-heading"
      className="relative w-full"
      style={{ backgroundColor: '#7D3345' }}
    >
      <div
        ref={pinRef}
        className="about-us__pin relative w-full min-h-screen max-md:h-auto! max-md:min-h-0!"
        style={{
          height: '100dvh',
          minHeight: '100dvh',
          boxSizing: 'border-box',
        }}
      >
        <AboutUsPuzzleBackground motionRef={aboutPuzzleMotionRef} />
        <div
          className="about-us__inner max-md:flex max-md:flex-col max-md:gap-10 max-md:px-6 max-md:py-12"
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '1320px',
            height: '100%',
            minHeight: 'inherit',
            margin: '0 auto',
          }}
        >
          <div
            className="about-us__graphics max-md:relative! max-md:mx-auto max-md:translate-none!"
            style={{
              position: 'absolute',
              left: SIDE_INSET,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'clamp(260px, 36vw, 440px)',
              height: 'clamp(260px, 42vh, 440px)',
              zIndex: 2,
            }}
          >
            <img
              id="about-us-heading"
              src={TITLE_SRC}
              alt="About us"
              className="about-us__title"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'block',
                width: 'clamp(200px, 24vw, 320px)',
                height: 'auto',
              }}
            />
            <img
              src={STARS_SRC}
              alt=""
              aria-hidden="true"
              className="about-us__stars"
              style={{
                position: 'absolute',
                top: '-28%',
                right: '-14%',
                display: 'block',
                width: 'clamp(100px, 13vw, 170px)',
                height: 'auto',
                pointerEvents: 'none',
              }}
            />
            <img
              src={ELECTRIC_SRC}
              alt=""
              aria-hidden="true"
              className="about-us__electric"
              style={{
                position: 'absolute',
                bottom: '6%',
                left: '12%',
                display: 'block',
                width: 'clamp(72px, 9vw, 120px)',
                height: 'auto',
                pointerEvents: 'none',
              }}
            />
            <img
              src={CURSOR_SRC}
              alt=""
              aria-hidden="true"
              className="about-us__cursor"
              style={{
                position: 'absolute',
                bottom: '6%',
                right: '-2%',
                display: 'block',
                width: 'clamp(64px, 8vw, 104px)',
                height: 'auto',
                pointerEvents: 'none',
              }}
            />
          </div>

          <div
            ref={copyViewportRef}
            className="about-us__copy-viewport max-md:relative! max-md:inset-auto! max-md:h-auto! max-md:w-full! max-md:overflow-visible! max-md:px-0"
            style={{
              position: 'absolute',
              top: 0,
              right: SIDE_INSET,
              width: 'min(580px, calc(52vw - 48px))',
              height: '100dvh',
              overflow: 'hidden',
              zIndex: 1,
            }}
          >
            <div
              ref={copyTrackRef}
              className="about-us__copy-track"
              style={{
                willChange: 'transform',
                transform: 'translateZ(0)',
              }}
            >
              {ABOUT_CHAPTERS.map(({ id, heading, body }) => (
                <article
                  key={id}
                  className="about-us__chapter max-md:min-h-0!"
                  data-about-chapter={id}
                  style={{
                    minHeight: '100dvh',
                    display: 'flex',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <div className="about-us__chapter-inner">
                    <h3
                      className="about-us__chapter-heading"
                      style={{
                        margin: '0 0 clamp(16px, 2.5vh, 28px)',
                        fontFamily: '"Recoleta", Georgia, serif',
                        fontWeight: 600,
                        fontSize: 'clamp(22px, 3vh, 36px)',
                        lineHeight: 1.15,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: '#A5D8FF',
                      }}
                    >
                      {heading}
                    </h3>
                    <p
                      className="about-us__chapter-body"
                      style={{
                        margin: 0,
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontWeight: 400,
                        fontSize: 'clamp(17px, 2.2vh, 26px)',
                        lineHeight: 1.55,
                        color: '#FFFFFF',
                        maxWidth: '52ch',
                      }}
                    >
                      {body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
