import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Star SVG separator matching the design
const NavSeparator = () => (
  <img
    src="/star.svg"
    alt=""
    aria-hidden="true"
    style={{ width: '44px', height: '44px', flexShrink: 0 }}
  />
);

const navItems = [
  { name: 'About Us',         href: '#about' },
  { name: 'What We Do',       href: '#services' },
  { name: 'How We Match',     href: '#how' },
  { name: 'Our Work',         href: '#projects' },
  { name: 'Let Us Match You', href: '#contact' },
];

// Total navbar height to match the blue cover band in the design
const NAVBAR_HEIGHT = 310;
const NAV_CONTENT_HEIGHT = 200;

const Navbar = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <nav
      className="relative w-full z-50"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      {/* Full-height background cover image */}
      <img
        src="/navbarcover.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top center',
          zIndex: 0,
        }}
      />

      <img
        src="/brandName.svg"
        alt="Matchitt"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '-24px',
          width: '240px',
          height: 'auto',
          transform: 'translateX(-50%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* All content sits above the cover */}
      <div style={{ position: 'relative', zIndex: 2, height: `${NAV_CONTENT_HEIGHT}px`, display: 'flex', flexDirection: 'column' }}>

        {/* Top row: Logo + Tagline inline, top-left */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            paddingTop: '28px',
            paddingLeft: '54px',
          }}
        >
          <span
            style={{
              fontFamily: '"Senegal", Georgia, serif',
              fontWeight: 600,
              fontSize: '28px',
              color: '#7D3345',
              opacity: 0.72,
              letterSpacing: '0.035em',
              lineHeight: 0.86,
              transform: 'scaleX(0.78)',
              transformOrigin: 'left center',
              display: 'inline-block',
            }}
          >
            MATCHITT
          </span>
          <span
            style={{
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontWeight: 400,
              fontSize: '15px',
              color: '#7D3345',
              opacity: 0.72,
              letterSpacing: '0',
              lineHeight: 'normal',
            }}
          >
            We Match You To Your Audience
          </span>
        </div>

        {/* Nav links: centered horizontally, vertically in the lower portion of the band */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {navItems.map((item, index) => (
              <React.Fragment key={item.name}>
                <a
                  href={item.href}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    position: 'relative',
                    fontFamily: '"Recoleta", Georgia, serif',
                    fontWeight: 600,
                    fontSize: '20px',
                    color: '#7D3345',
                    textDecoration: 'none',
                    letterSpacing: '0',
                    padding: '4px 2px',
                    transition: 'opacity 0.2s',
                    opacity: hovered !== null && hovered !== index ? 0.5 : 1,
                  }}
                >
                  {item.name}
                  {/* Animated underline */}
                  <motion.span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      height: '1.5px',
                      backgroundColor: '#7D3345',
                      display: 'block',
                    }}
                    animate={{ width: hovered === index ? '100%' : '0%' }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  />
                </a>

                {/* Star separator between items */}
                {index < navItems.length - 1 && <NavSeparator />}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
