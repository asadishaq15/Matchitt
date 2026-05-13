import { motion } from 'framer-motion';

const HERO_TOP_PADDING = 0;

const heroStickers = [
  { src: '/blueFolder.svg', top: '8%', left: '13%', width: 34, driftX: 8, driftY: -10, duration: 7.4 },
  { src: '/red-folder.svg', top: '13%', left: '7%', width: 34, driftX: -7, driftY: 9, duration: 8.2 },
  { src: '/blueFolder.svg', top: '19%', left: '20%', width: 36, driftX: 10, driftY: 8, duration: 7.8 },
  { src: '/red-folder.svg', top: '26%', left: '10%', width: 36, driftX: -8, driftY: -9, duration: 8.8 },
  { src: '/blueFolder.svg', top: '33%', left: '14%', width: 34, driftX: 7, driftY: 11, duration: 7.6 },
  { src: '/blueFolder.svg', top: '40%', left: '26%', width: 38, driftX: -9, driftY: 8, duration: 8.4 },
  { src: '/red-folder.svg', top: '53%', left: '17%', width: 36, driftX: 9, driftY: -8, duration: 8 },
  { src: '/blueFolder.svg', top: '8%', left: '82%', width: 34, driftX: -8, driftY: 10, duration: 7.7 },
  { src: '/red-folder.svg', top: '15%', left: '61%', width: 36, driftX: 8, driftY: -9, duration: 8.6 },
  { src: '/red-folder.svg', top: '19%', left: '75%', width: 36, driftX: -10, driftY: -7, duration: 7.9 },
  { src: '/blueFolder.svg', top: '25%', left: '94%', width: 36, driftX: -8, driftY: 9, duration: 8.3 },
  { src: '/blueFolder.svg', top: '35%', left: '81%', width: 36, driftX: 9, driftY: 8, duration: 7.5 },
  { src: '/red-folder.svg', top: '43%', left: '74%', width: 36, driftX: -7, driftY: 10, duration: 8.1 },
  { src: '/blueFolder.svg', top: '53%', left: '78%', width: 36, driftX: 8, driftY: -8, duration: 8.7 },
  { src: '/red-folder.svg', top: '58%', left: '92%', width: 36, driftX: -9, driftY: 7, duration: 7.8 },
  { src: '/yeahText.svg', top: '39%', left: '31%', width: 70, rotate: -18, driftX: 12, driftY: -10, duration: 6.9 },
  { src: '/Smile.svg', top: '56%', left: '24%', width: 72, rotate: -12, driftX: -10, driftY: 12, duration: 7.2 },
  { src: '/CoolVibe.svg', top: '76%', left: '26%', width: 92, rotate: 10, driftX: 12, driftY: 10, duration: 8.5 },
  { src: '/CoolVibe.svg', top: '69%', left: '86%', width: 76, rotate: -8, driftX: -12, driftY: -9, duration: 8.1 },
];

const Hero = () => {
  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ paddingTop: `${HERO_TOP_PADDING}px` }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: `${HERO_TOP_PADDING}px`,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {heroStickers.map((sticker, index) => (
          <div
            key={`${sticker.src}-${index}`}
            style={{
              position: 'absolute',
              top: sticker.top,
              left: sticker.left,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <motion.img
              src={sticker.src}
              alt=""
              animate={{
                x: [0, sticker.driftX, 0],
                y: [0, sticker.driftY, 0],
                rotate: [sticker.rotate || 0, (sticker.rotate || 0) + 4, sticker.rotate || 0],
              }}
              transition={{
                duration: sticker.duration,
                delay: index * 0.12,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                display: 'block',
                width: `${sticker.width}px`,
                height: 'auto',
              }}
            />
          </div>
        ))}
      </div>
      {/* Hero content removed */}
    </section>
  );
};

export default Hero;
