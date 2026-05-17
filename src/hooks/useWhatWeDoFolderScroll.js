import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onScrollReady, SCROLL_ROOT } from '../lib/scrollEngine';

gsap.registerPlugin(ScrollTrigger);

const scrollTriggerBase = {
  scroller: SCROLL_ROOT,
  invalidateOnRefresh: true,
};

const DESKTOP_MQ = '(min-width: 769px) and (prefers-reduced-motion: no-preference)';
const FALLBACK_MQ = '(max-width: 768px), (prefers-reduced-motion: reduce)';

const SCROLL_VH_PER_CARD = 0.26;
const CARD_STAGGER = 1.35;
const CARD_ENTER_DURATION = 1.1;
const SCRUB_SMOOTHNESS = 1.15;
const ENTER_Y = 56;
const END_HOLD_DURATION = 0.4;

const waitForImages = (container) => {
  const images = container.querySelectorAll('img');
  if (images.length === 0) return Promise.resolve();

  return Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        }),
    ),
  );
};

export const useWhatWeDoFolderScroll = ({
  sectionRef,
  pinRef,
  cardRefs,
  headerRef,
}) => {
  useGSAP(
    () => {
      let mm;
      let disposed = false;

      const setup = () => {
        if (disposed) return;

        const section = sectionRef.current;
        const pin = pinRef.current;
        const cards = cardRefs.current.filter(Boolean);

        if (!section || !pin || cards.length === 0) return;

        const scrollDistance = () =>
          window.innerHeight * SCROLL_VH_PER_CARD * cards.length;

        mm = gsap.matchMedia();

        mm.add(FALLBACK_MQ, () => {
          gsap.set(cards, { autoAlpha: 1, y: 0, clearProps: 'transform' });
          if (headerRef?.current) {
            gsap.set(headerRef.current, {
              autoAlpha: 1,
              y: 0,
              clearProps: 'transform',
            });
          }
        });

        mm.add(DESKTOP_MQ, () => {
          if (headerRef?.current) {
            gsap.from(headerRef.current, {
              autoAlpha: 0,
              y: 24,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                ...scrollTriggerBase,
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            });
          }

          gsap.set(cards, { autoAlpha: 0, y: ENTER_Y });

          const tl = gsap.timeline({
            scrollTrigger: {
              ...scrollTriggerBase,
              trigger: pin,
              start: 'top top',
              end: () => `+=${scrollDistance()}`,
              pin: true,
              pinSpacing: true,
              scrub: SCRUB_SMOOTHNESS,
              anticipatePin: 1,
              fastScrollEnd: true,
            },
          });

          cards.forEach((card, i) => {
            tl.to(
              card,
              {
                autoAlpha: 1,
                y: 0,
                duration: CARD_ENTER_DURATION,
                ease: 'power3.out',
                force3D: true,
              },
              i * CARD_STAGGER,
            );
          });

          tl.to({}, { duration: END_HOLD_DURATION });

          const refreshAfterLayout = () => {
            requestAnimationFrame(() => {
              ScrollTrigger.refresh();
            });
          };

          waitForImages(pin).then(refreshAfterLayout);
          refreshAfterLayout();
        });
      };

      const unsub = onScrollReady(setup);

      return () => {
        disposed = true;
        unsub();
        mm?.revert();
      };
    },
    { scope: sectionRef, dependencies: [] },
  );
};
