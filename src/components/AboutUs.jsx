import { useRef } from 'react';
import { useAboutUsTextScroll } from '../hooks/useAboutUsTextScroll';

const TITLE_SRC = '/AboutUs/AboutUsTitle.png';
const STARS_SRC = '/AboutUs/AboutUsStars.png';
const ELECTRIC_SRC = '/AboutUs/AboutUsElectric.png';
const CURSOR_SRC = '/AboutUs/AboutUsCursor.png';

const ABOUT_CHAPTERS = [
  {
    id: 'noise',
    heading: 'THE NOISE',
    body: 'Too much content, too many trends—most brands need direction, not volume.',
  },
  {
    id: 'belief',
    heading: 'OUR BELIEF',
    body: 'Matchitt started on one idea: say less, mean more, reach the people who matter.',
  },
  {
    id: 'match',
    heading: 'HOW WE MATCH',
    body: 'Strategy first, then creative, content, and paid—all aligned to one clear message.',
  },
  {
    id: 'results',
    heading: 'WHAT YOU GET',
    body: 'No generic playbooks. Measurable work that connects you to your audience.',
  },
];

const AboutUs = () => {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const copyViewportRef = useRef(null);
  const copyTrackRef = useRef(null);

  useAboutUsTextScroll({
    sectionRef,
    pinRef,
    copyViewportRef,
    copyTrackRef,
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
        className="about-us__pin relative flex w-full min-h-screen max-md:h-auto! max-md:min-h-0!"
        style={{
          height: '100dvh',
          minHeight: '100dvh',
          boxSizing: 'border-box',
          padding: 'clamp(32px, 5vh, 64px) clamp(24px, 6vw, 96px)',
        }}
      >
        <div
          className="about-us__inner"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'stretch',
            justifyContent: 'space-between',
            gap: 'clamp(40px, 5vw, 96px)',
            width: '100%',
            maxWidth: '1320px',
            margin: '0 auto',
            flex: 1,
            minHeight: 0,
          }}
        >
          <div
            className="about-us__graphics max-md:mx-auto"
            style={{
              position: 'relative',
              flex: '0 0 auto',
              width: 'clamp(260px, 36vw, 440px)',
              height: 'clamp(260px, 42vh, 440px)',
              alignSelf: 'center',
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
                top: '-6%',
                right: '-10%',
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
                bottom: '12%',
                left: '8%',
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
            className="about-us__copy-viewport max-md:h-auto! max-md:min-h-0! max-md:overflow-visible!"
            style={{
              flex: '1 1 300px',
              maxWidth: 'min(100%, 580px)',
              minHeight: 0,
              height: '100%',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              ref={copyTrackRef}
              className="about-us__copy-track"
              style={{ willChange: 'transform' }}
            >
              {ABOUT_CHAPTERS.map(({ id, heading, body }) => (
                <article
                  key={id}
                  className="about-us__chapter max-md:min-h-0!"
                  data-about-chapter={id}
                  style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    padding: 'clamp(24px, 4vh, 48px) 0',
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
