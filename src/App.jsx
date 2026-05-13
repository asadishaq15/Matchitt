import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Footer from './components/Footer';
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
        <About />
        <Services />
        
        {/* Simple Projects Preview Section */}
        <section id="projects" className="py-32 bg-burgundy text-cream">
          <div className="container mx-auto px-4">
            <h2 className="text-6xl md:text-8xl font-bold mb-20 text-center">Selected <br /><span className="italic text-accent-blue">Works</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-video bg-cream/10 rounded-sm overflow-hidden mb-6 relative">
                    <div className="absolute inset-0 bg-burgundy/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <div className="w-full h-full flex items-center justify-center text-cream/20 text-4xl font-bold">PROJECT {i}</div>
                  </div>
                  <h3 className="text-2xl font-bold">Artistic Fragment 0{i}</h3>
                  <p className="text-cream/60 uppercase tracking-widest text-xs mt-2">Branding / Digital</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
