import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const HowWeMatch = () => {
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
    id="how"
    aria-labelledby="how-we-match-heading"
    className="relative bg-cream"
    style={{
      padding: 'clamp(48px, 8vh, 96px) clamp(16px, 4vw, 32px) clamp(40px, 6vh, 72px)',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <img
        id="how-we-match-heading"
        src="/Match/How_we_match.png"
        alt="How we match: The Matchitt way"
        style={{
          display: 'block',
          width: 'min(520px, 88vw)',
          height: 'auto',
        }}
      />
    </div>
  </section>
  );
};

export default HowWeMatch;
