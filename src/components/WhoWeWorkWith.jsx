import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WHO_WE_WORK_WITH_CLIENT_HEADINGS } from '../constants/whoWeWorkWithClients';

const HERO_SRC = '/workWith/whoweworkwith.png';
const WRAPPER_SRC = '/workWith/whoweworkwithWrapper.png';
const TITLE_SRC = '/workWith/whoweworkwithTitle.png';
const HERO_ASPECT = '1728 / 692';
const WRAPPER_SCALE = 3.5;
const WRAPPER_OFFSET_Y = 'clamp(36px, 7vh, 100px)';
const WRAPPER_OPACITY = 0.46;

const WhoWeWorkWith = () => {
  useEffect(() => {
    const refresh = () => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    refresh();
    window.addEventListener('resize', refresh);
    return () => window.removeEventListener('resize', refresh);
  }, []);

  return (
    <section
      id="who-we-work-with"
      aria-labelledby="who-we-work-with-title"
      className="relative w-full bg-cream overflow-visible"
      style={{
        paddingBottom: 'clamp(72px, 10vh, 140px)',
      }}
    >
      <div
        className="who-we-work-with__hero"
        style={{
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          className="who-we-work-with__media"
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: HERO_ASPECT,
            lineHeight: 0,
            overflow: 'hidden',
          }}
        >
          <img
            src={HERO_SRC}
            alt=""
            aria-hidden="true"
            className="who-we-work-with__photo"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          <img
            src={WRAPPER_SRC}
            alt=""
            aria-hidden="true"
            className="who-we-work-with__wrapper"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transform: `translate(-50%, calc(-50% + ${WRAPPER_OFFSET_Y})) scale(${WRAPPER_SCALE})`,
              opacity: WRAPPER_OPACITY,
              pointerEvents: 'none',
            }}
          />
        </div>
        <div
          className="who-we-work-with__title-wrap"
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            transform: 'translate(-50%, 50%)',
            zIndex: 3,
            width: 'min(220px, 30vw)',
            pointerEvents: 'none',
          }}
        >
          <img
            id="who-we-work-with-title"
            src={TITLE_SRC}
            alt="Who we work with"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
            }}
          />
        </div>
      </div>

      <div
        className="who-we-work-with__clients"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(28px, 4.5vh, 52px)',
          marginTop: 'clamp(96px, 14vh, 168px)',
          padding: 'clamp(40px, 6vh, 72px) clamp(16px, 4vw, 32px) 0',
        }}
      >
     

        <div
          role="list"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(28px, 4.5vh, 52px)',
            width: '100%',
          }}
        >
          {WHO_WE_WORK_WITH_CLIENT_HEADINGS.map((heading, index) => (
            <p
              key={`${heading}-${index}`}
              role="listitem"
              style={{
                margin: 0,
                fontFamily: '"Recoleta", Georgia, serif',
                fontWeight: 700,
                fontSize: 'clamp(52px, 9vw, 112px)',
                lineHeight: 1.05,
                color: '#7D3345',
                textAlign: 'center',
              }}
            >
              {heading}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoWeWorkWith;
