import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PuzzleJoinSection = () => {
  useEffect(() => {
    const refresh = () => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    refresh();
    window.addEventListener('resize', refresh);
    return () => window.removeEventListener('resize', refresh);
  }, []);

  return (
    <section
      id="puzzle-join"
      aria-label="Puzzle assembly"
      className="relative bg-transparent"
      style={{
        minHeight: '100vh',
        pointerEvents: 'none',
      }}
    />
  );
};

export default PuzzleJoinSection;
