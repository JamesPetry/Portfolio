'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactSection from './ContactSection';
import SkillMatrix from './SkillMatrix';
import ToolProficiency from './ToolProficiency';
import { HiArrowUp } from 'react-icons/hi';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const aboutRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const backToTopRef = useRef<HTMLButtonElement>(null);
  const bottomLeftRef = useRef<HTMLDivElement>(null);
  const bottomCenterRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aboutRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll('[data-type-char]');
        tl.fromTo(
          chars,
          { opacity: 0, y: 10, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out', stagger: 0.012 },
          0
        );
      }

      if (paragraphRef.current) {
        const chars = paragraphRef.current.querySelectorAll('[data-type-char]');
        tl.fromTo(
          chars,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'none', stagger: 0.006 },
          0.2
        );
      }

      if (iconsRef.current) {
        const items = iconsRef.current.querySelectorAll('a');
        tl.fromTo(
          items,
          { opacity: 0, y: 10, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out', stagger: 0.08 },
          0.75
        );
      }

      if (bottomBarRef.current) {
        const bottomChars = bottomBarRef.current.querySelectorAll('[data-type-char]');
        let hasAnimatedChars = false;
        
        // Function to animate characters (only once)
        const animateBottomBarChars = () => {
          if (!hasAnimatedChars && bottomChars.length > 0) {
            hasAnimatedChars = true;
            gsap.fromTo(
              bottomChars,
              { opacity: 0, y: 6 },
              {
                opacity: 1,
                y: 0,
                duration: 0.35,
                ease: 'none',
                stagger: 0.012,
              }
            );
          }
        };

        // Animate bottom bar as part of main timeline
        tl.fromTo(
          bottomBarRef.current,
          { opacity: 0, y: 14 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.55, 
            ease: 'power2.out',
            onComplete: animateBottomBarChars,
          },
          0.85
        );

        // Create a ScrollTrigger to ensure bottom bar is visible when section is in viewport
        const bottomBarTrigger = ScrollTrigger.create({
          trigger: aboutRef.current,
          start: 'top bottom',
          end: 'bottom top',
          immediateRender: false,
          onEnter: () => {
            // Ensure bottom bar is visible when section enters viewport
            gsap.set(bottomBarRef.current, { opacity: 1, y: 0 });
            animateBottomBarChars();
          },
          onEnterBack: () => {
            // Ensure bottom bar is visible when scrolling back
            gsap.set(bottomBarRef.current, { opacity: 1, y: 0 });
            animateBottomBarChars();
          },
        });

        // Check if section is already in viewport on mount and show bottom bar
        setTimeout(() => {
          if (bottomBarRef.current && aboutRef.current) {
            const rect = aboutRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            // If section is already in viewport (top is above bottom of window and bottom is below top of window)
            if (rect.top < windowHeight && rect.bottom > 0) {
              gsap.set(bottomBarRef.current, { opacity: 1, y: 0 });
              animateBottomBarChars();
            }
          }
        }, 100);
      }
    }, aboutRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    const heroSection = document.getElementById('hero');
    heroSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={aboutRef}
      className="relative w-full h-[100svh] bg-white snap-start snap-always overflow-y-auto"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-16 min-h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-start pt-12 md:pt-16 pb-4">
          <h2
            ref={titleRef}
            className="text-black text-center font-black tracking-[-0.05em] leading-[1.0] text-[48px] md:text-[72px] lg:text-[96px]"
            style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            {renderTypeText('About Me.')}
          </h2>

          <p
            ref={paragraphRef}
            className="mt-6 md:mt-8 text-black text-center font-medium tracking-[-0.02em] leading-[1.35] text-[16px] md:text-[20px] lg:text-[24px] max-w-[900px]"
            style={{ 
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              hyphens: 'none',
              WebkitHyphens: 'none',
              MozHyphens: 'none',
              msHyphens: 'none',
              overflowWrap: 'break-word',
              wordWrap: 'break-word',
              wordBreak: 'normal'
            }}
          >
            {renderTypeText(
              'I am a computational designer exploring the intersection of architecture, technology, and environmental systems. My work integrates parametric modelling, algorithmic design, and digital fabrication to create solutions that respond to complex spatial and ecological challenges.'
            )}
          </p>

          {/* Skills & Tools - Grouped together with reduced spacing */}
          <div className="mt-10 md:mt-12 w-full space-y-6 md:space-y-8">
            {/* Skill Matrix - Condensed */}
            <div>
              <SkillMatrix />
            </div>

            {/* Tool Proficiency */}
            <div>
              <ToolProficiency />
            </div>
          </div>

          {/* Contact - Simplified, no heading */}
          <div ref={iconsRef} className="mt-10 md:mt-12 flex justify-center mb-8">
            <ContactSection />
          </div>
        </div>

        {/* Bottom bar (Figma) */}
        <div
          ref={bottomBarRef}
          className="w-full border-t border-black/10 pt-3 md:pt-4 pb-3 md:pb-4 flex items-center mt-auto"
        >
          <div className="flex-1 flex items-center">
            <div
              ref={bottomLeftRef}
              className="text-black font-black tracking-[-0.05em] text-[18px] md:text-[20px] lg:text-[24px]"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {renderTypeText('James Petry.')}
            </div>
          </div>

          <button
            ref={bottomCenterRef}
            onClick={scrollToTop}
            type="button"
            className="flex-none flex items-center gap-2 text-black font-medium tracking-[-0.04em] text-[16px] md:text-[18px] lg:text-[20px] hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
            aria-label="Back to top"
          >
            <span className="inline-flex">{renderTypeText('Back To Top')}</span>
            <HiArrowUp className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <div className="flex-1" aria-hidden />
        </div>
      </div>
    </section>
  );
}

function renderTypeText(text: string) {
  const words = text.split(/\s+/);
  return words.map((word, wordIndex, array) => (
    <span key={`word-${wordIndex}`}>
      <span className="inline-block" style={{ whiteSpace: 'nowrap' }}>
        {Array.from(word).map((ch, charIndex) => (
    <span
            key={`${wordIndex}-${charIndex}`}
      data-type-char
      className="inline-block"
      style={{
        opacity: 0,
      }}
    >
      {ch}
          </span>
        ))}
      </span>
      {wordIndex < array.length - 1 && (
        <span className="inline-block" style={{ width: '0.25em' }} aria-hidden="true">
          {' '}
        </span>
      )}
    </span>
  ));
}

