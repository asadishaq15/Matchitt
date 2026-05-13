import { motion } from 'framer-motion';

const Sticker = ({ 
  children, 
  className = '', 
  rotation = 0, 
  scale = 1,
  delay = 0,
  duration = 5,
  floatIntensity = 20
}) => {
  return (
    <motion.div
      className={`absolute select-none pointer-events-none ${className}`}
      initial={{ opacity: 0, scale: 0.5, rotate: rotation - 20 }}
      animate={{ 
        opacity: 1, 
        scale: scale, 
        rotate: rotation,
        y: [0, -floatIntensity, 0],
      }}
      transition={{
        opacity: { duration: 0.8, delay },
        scale: { duration: 0.8, delay, type: 'spring' },
        rotate: { duration: 1.2, delay, type: 'spring' },
        y: {
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay
        }
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-black/10 blur-md translate-x-2 translate-y-2 rounded-full" />
        <div className="relative bg-white p-2 rounded-sm border border-gray-100 shadow-sm">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default Sticker;
