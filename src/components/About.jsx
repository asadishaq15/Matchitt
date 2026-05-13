import { motion } from 'framer-motion';
import Sticker from './Sticker';
import { Camera, PenTool, Lightbulb } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            {/* Collage of images (placeholders) */}
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white p-4 pb-12 scrapbook-shadow -rotate-3"
              >
                <div className="aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden mb-4">
                  <div className="w-full h-full bg-burgundy/10 flex items-center justify-center">
                    <Camera className="text-burgundy/20 w-12 h-12" />
                  </div>
                </div>
                <p className="font-handwritten text-center text-burgundy/40">Our Vision</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white p-4 pb-12 scrapbook-shadow rotate-6 mt-12"
              >
                <div className="aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden mb-4">
                  <div className="w-full h-full bg-accent-blue/10 flex items-center justify-center">
                    <PenTool className="text-accent-blue/20 w-12 h-12" />
                  </div>
                </div>
                <p className="font-handwritten text-center text-accent-blue">The Process</p>
              </motion.div>
            </div>

            <Sticker className="top-1/2 -left-10 z-20" rotation={-20} scale={1.2}>
              <div className="p-2">
                <Lightbulb className="text-accent-yellow fill-accent-yellow w-6 h-6" />
              </div>
            </Sticker>
          </div>

          <div className="flex flex-col gap-8">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-burgundy/40 font-bold uppercase tracking-[0.3em] text-xs"
            >
              Who We Are
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-burgundy leading-[1.1]"
            >
              We don't just build brands. <br />
              <span className="text-accent-blue italic">We curate them.</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-burgundy/60 font-medium leading-relaxed"
            >
              Matchitt was born from a desire to bridge the gap between artistic exploration and commercial success. Like a masterfully crafted scrapbook, we piece together fragments of ideas, culture, and strategy to create a cohesive, impactful narrative for your brand.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-6 mt-4"
            >
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-cream bg-burgundy/10 flex items-center justify-center text-[10px] font-bold">M</div>
                ))}
              </div>
              <p className="text-sm font-medium text-burgundy/40">
                <span className="text-burgundy font-bold">50+</span> Projects Completed
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
