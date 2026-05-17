import { forwardRef, useRef } from 'react';
import { useWhatWeDoFolderScroll } from '../hooks/useWhatWeDoFolderScroll';

const LABEL_BOTTOM = 'clamp(-18px, -2vw, -26px)';
const LABEL_BOTTOM_EXTRA = 'clamp(-28px, -3.2vw, -38px)';
const LABEL_WIDTH_SINGLE = 'clamp(68%, 72%, 76%)';
const LABEL_WIDTH_MULTI = 'clamp(54%, 58%, 62%)';

const TOP_ROW = [
  { serviceSrc: '/services/branding.png', serviceAlt: 'Branding', variant: 'blue', labelLines: 1 },
  { serviceSrc: '/services/ContentCreation.png', serviceAlt: 'Content Creation', variant: 'red', labelLines: 2, labelBottom: 'clamp(-36px, -4vw, -48px)' },
  { serviceSrc: '/services/DigitalStaretgy.png', serviceAlt: 'Digital Strategy', variant: 'blue', labelLines: 1 },
  { serviceSrc: '/services/SSM.png', serviceAlt: 'Social Media Management', variant: 'red', labelLines: 2, labelBottom: LABEL_BOTTOM_EXTRA },
  { serviceSrc: '/services/PA.png', serviceAlt: 'Paid Amplification', variant: 'blue', labelLines: 2 },
];

const BOTTOM_ROW = [
  { serviceSrc: '/services/Creative&Design.png', serviceAlt: 'Creative & Design', variant: 'red', labelLines: 2, labelBottom: LABEL_BOTTOM_EXTRA },
  { serviceSrc: '/services/IE.png', serviceAlt: 'Influencer Engagement', variant: 'blue', labelLines: 2, labelBottom: LABEL_BOTTOM_EXTRA },
  { serviceSrc: '/services/SEO.png', serviceAlt: 'SEO & Website', variant: 'red', labelLines: 1 },
  { serviceSrc: '/services/SEM.png', serviceAlt: 'SEM & Programmatic', variant: 'blue', labelLines: 2 },
];

const getLabelStyle = ({ labelLines, labelBottom }) => ({
  position: 'absolute',
  left: '50%',
  right: 'auto',
  bottom: labelBottom ?? LABEL_BOTTOM,
  transform: 'translateX(-50%)',
  width: labelLines === 2 ? LABEL_WIDTH_MULTI : LABEL_WIDTH_SINGLE,
  pointerEvents: 'none',
});

const FOLDER_SRC = {
  blue: '/blue-folder-what.png',
  red: '/red-folder-what.png',
};

const FOLDER_WIDTH = {
  blue: 'clamp(175px, 20vw, 414px)',
  red: 'clamp(184px, 21.2vw, 439px)',
};

const FolderCard = forwardRef(function FolderCard(
  { serviceSrc, serviceAlt, labelLines, labelBottom, variant, left, top, zIndex },
  ref,
) {
  return (
    <div
      ref={ref}
      className="what-we-do-folder-card"
      style={{
        position: 'absolute',
        left,
        top,
        zIndex,
        width: FOLDER_WIDTH[variant],
        willChange: 'transform, opacity',
      }}
    >
      <img
        src={FOLDER_SRC[variant]}
        alt=""
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
        }}
      />
      <div style={getLabelStyle({ labelLines, labelBottom })}>
        <img
          src={serviceSrc}
          alt={serviceAlt}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
          }}
        />
      </div>
    </div>
  );
});

const FOLDER_OFFSET_X = [
  '0px',
  'clamp(17px, 2.1vw, 31px)',
  'clamp(28px, 3.5vw, 52px)',
  'clamp(42px, 5.3vw, 76px)',
  'clamp(57px, 7.1vw, 99px)',
];

const getFolderOffsetX = (index) =>
  FOLDER_OFFSET_X[Math.min(index, FOLDER_OFFSET_X.length - 1)];

const variantNudgeX = 'clamp(6px, 0.7vw, 11px)';

const getFolderTweakX = (rowIndex, index, variant) => {
  const parts = [];

  const isBlueNudge =
    variant === 'blue' && (rowIndex === 0 || (rowIndex === 1 && index === 3));

  const isRedNudge =
    variant === 'red' &&
    ((rowIndex === 0 && (index === 1 || index === 3)) ||
      (rowIndex === 1 && index === 2));

  if (isBlueNudge || isRedNudge) {
    parts.push(variantNudgeX);
  }

  if (rowIndex === 0) {
    if (index === 2) parts.push('clamp(7px, 0.9vw, 13px)');
    else if (index === 3) parts.push('clamp(17px, 1.9vw, 26px)');
    else if (index === 4) parts.push('clamp(28px, 3.2vw, 42px)');
  } else if (rowIndex === 1 && index === 3) {
    parts.push('clamp(21px, 2.4vw, 33px)');
  }

  if (parts.length === 0) return '0px';
  if (parts.length === 1) return parts[0];
  return `calc(${parts.join(' + ')})`;
};

const WhatWeDo = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const pinRef = useRef(null);
  const cardRefs = useRef([]);

  const rowShiftX = 'clamp(24px, 3vw, 47px)';
  const clusterShiftX = 'clamp(-38px, -4.7vw, -66px)';
  const clusterShiftY = 'clamp(-28px, -3.2vh, -44px)';
  const rowShiftY = 'clamp(-20px, -2.4vw, -34px)';
  const stagePadTop = 'clamp(34px, 4.2vw, 58px)';
  const stepX = 'clamp(111px, 14.4vw, 250px)';
  const stepY = 'clamp(26px, 3.1vw, 47px)';
  const rowGap = 'clamp(160px, 17.7vw, 260px)';
  const row2StartX = `calc(${stepX} - clamp(33px, 4.1vw, 61px))`;
  const row2StartY = `calc(2.5 * ${stepY} + ${rowGap})`;

  const stageWidth = 'clamp(680px, 88vw, 1520px)';
  const stageHeight = `calc(${stagePadTop} + 6 * ${stepY} + ${rowGap} + clamp(200px, 23vw, 400px))`;

  useWhatWeDoFolderScroll({ sectionRef, pinRef, cardRefs, headerRef });

  const setCardRef = (index) => (el) => {
    cardRefs.current[index] = el;
  };

  const positionFolder = (rowIndex, index, variant) => {
    const baseX = rowIndex === 0 ? '0px' : row2StartX;
    const baseY = rowIndex === 0 ? '0px' : row2StartY;
    const folderOffsetX = getFolderOffsetX(index);
    const folderTweakX = getFolderTweakX(rowIndex, index, variant);

    return {
      left: `calc(${baseX} + ${rowShiftX} + ${clusterShiftX} + ${folderOffsetX} + ${folderTweakX} + ${index} * ${stepX})`,
      top:
        index === 0
          ? `calc(${stagePadTop} + ${baseY} + ${rowShiftY} + ${clusterShiftY})`
          : `calc(${stagePadTop} + ${baseY} + ${rowShiftY} + ${clusterShiftY} + ${index} * ${stepY})`,
      zIndex: rowIndex === 0 ? index + 1 : TOP_ROW.length + index + 1,
    };
  };

  return (
    <section
      ref={sectionRef}
      id="what-we-do"
      className="relative bg-cream"
      style={{ padding: 'clamp(72px, 10vh, 120px) 0 clamp(96px, 12vh, 140px)' }}
    >
      <div
        className="overflow-x-hidden"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(20px, 3vh, 32px)',
          padding: '0 clamp(8px, 1.5vw, 24px)',
        }}
      >
        <div
          ref={headerRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(20px, 3vh, 32px)',
            width: '100%',
          }}
        >
          <img
            src="/what-we-do.png"
            alt="What we do"
            style={{
              display: 'block',
              width: 'min(410px, 72vw)',
              height: 'auto',
            }}
          />

          <p
            style={{
              margin: 0,
              maxWidth: '640px',
              textAlign: 'center',
              fontFamily: '"Recoleta", Georgia, serif',
              fontSize: 'clamp(18px, 2.2vw, 26px)',
              fontWeight: 500,
              lineHeight: 1.35,
              color: '#7D3345',
            }}
          >
            Getting your brand in front of the right people in the right way.
          </p>
        </div>
      </div>

      <div
        ref={pinRef}
        className="what-we-do-pin"
        style={{
          position: 'relative',
          zIndex: 45,
          marginTop: 'clamp(32px, 5vh, 56px)',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          overflow: 'visible',
          paddingTop: '8px',
          paddingBottom: 'clamp(32px, 4vh, 56px)',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: stageWidth,
            height: stageHeight,
            flexShrink: 0,
          }}
        >
          {TOP_ROW.map((item, index) => {
              const pos = positionFolder(0, index, item.variant);
              return (
                <FolderCard
                  key={item.serviceSrc}
                  ref={setCardRef(index)}
                  serviceSrc={item.serviceSrc}
                  serviceAlt={item.serviceAlt}
                  labelLines={item.labelLines}
                  labelBottom={item.labelBottom}
                  variant={item.variant}
                  left={pos.left}
                  top={pos.top}
                  zIndex={pos.zIndex}
                />
              );
            })}
            {BOTTOM_ROW.map((item, index) => {
              const cardIndex = TOP_ROW.length + index;
              const pos = positionFolder(1, index, item.variant);
              return (
                <FolderCard
                  key={item.serviceSrc}
                  ref={setCardRef(cardIndex)}
                  serviceSrc={item.serviceSrc}
                  serviceAlt={item.serviceAlt}
                  labelLines={item.labelLines}
                  labelBottom={item.labelBottom}
                  variant={item.variant}
                  left={pos.left}
                  top={pos.top}
                  zIndex={pos.zIndex}
                />
              );
            })}
          </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
