import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  { title: 'Branding', color: '#800020' },
  { title: 'Content Creation', color: '#A5D8FF' },
  { title: 'Digital Strategy', color: '#FFD93D' },
  { title: 'Social Media Management', color: '#800020' },
  { title: 'Paid Amplification', color: '#A5D8FF' },
  { title: 'Creative Design', color: '#FFD93D' },
  { title: 'Influencer Engagement', color: '#800020' },
  { title: 'SEO Website', color: '#A5D8FF' },
  { title: 'SEM & Programmatic', color: '#FFD93D' },
];

const FolderCard = ({ service, index }) => {
  return (
    <motion.div
      whileHover={{ y: -20, rotate: index % 2 === 0 ? 2 : -2, scale: 1.02 }}
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="absolute inset-0 bg-black/5 blur-xl group-hover:bg-black/10 transition-colors rounded-2xl translate-x-4 translate-y-4" />
      
      <div className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden scrapbook-shadow">
        {/* Folder Tab */}
        <div 
          className="h-8 w-24 rounded-t-xl absolute -top-8 left-0"
          style={{ backgroundColor: index % 3 === 0 ? '#800020' : index % 3 === 1 ? '#A5D8FF' : '#FFD93D' }}
        />
        
        <div className="p-8 pt-10 min-h-[280px] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Service 0{index + 1}</span>
            <h3 className="text-3xl font-bold text-burgundy leading-tight">{service.title}</h3>
          </div>
          
          <div className="flex justify-between items-end">
            <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-burgundy group-hover:text-cream transition-all">
              <span className="text-xl">→</span>
            </div>
            <div className="font-handwritten text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              View Details
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const cards = gsap.utils.toArray('.folder-card');
    
    // Parallax effect on scroll
    cards.forEach((card, i) => {
      gsap.to(card, {
        y: (i % 3) * -50,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
  }, []);

  return (
    <section id="services" className="py-32 relative bg-cream-dark/50" ref={containerRef}>
      <div className="container mx-auto px-4">
        <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-bold text-burgundy mb-6">Our Services</h2>
            <p className="text-xl text-burgundy/60 font-medium">
              We offer a comprehensive suite of creative and strategic services designed to help your brand excel in the digital landscape.
            </p>
          </div>
          <div className="hidden md:block pb-4">
            <div className="font-handwritten text-3xl text-accent-blue -rotate-6">Crafted with care</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 px-4 md:px-10">
          {services.map((service, index) => (
            <div key={index} className="folder-card">
              <FolderCard service={service} index={index} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Background doodles */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 180C20 180 50 120 100 120C150 120 180 180 180 180" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
          <circle cx="100" cy="50" r="30" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </section>
  );
};

export default Services;
