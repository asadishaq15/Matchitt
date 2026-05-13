import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScrollingPuzzle from './components/ScrollingPuzzle';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import gsap from 'gsap';

function App() {
  useSmoothScroll();

  useEffect(() => {
    // Custom cursor logic
    const cursor = document.querySelector('.custom-cursor');
    
    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-cream selection:bg-accent-blue selection:text-burgundy">
      {/* Visual Enhancements */}
      <div className="grain-overlay" />
      <div className="custom-cursor hidden md:block" />
      
      <Navbar />
      <ScrollingPuzzle />
      
      <main>
        <Hero />
      </main>
    </div>
  );
}

export default App;
