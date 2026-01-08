'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import SkillsIndicator from './SkillsIndicator';
import dynamic from 'next/dynamic';

const HeroBackground = dynamic(() => import('./HeroBackground'), { ssr: false });

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const titleMaskRef = useRef<HTMLSpanElement>(null);
  const titleTextRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollArrowRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Ensure no initial flash before anim
      if (navRef.current) {
        gsap.set(navRef.current.querySelectorAll('button'), {
          opacity: 0,
          y: -10,
          filter: 'blur(4px)',
        });
      }
      if (titleMaskRef.current && titleTextRef.current) {
        gsap.set(titleMaskRef.current, { clipPath: 'inset(0 100% -0.22em -0.18em)', x: -26 });
        gsap.set(titleTextRef.current, { x: -38, filter: 'blur(10px)' });
      }
      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { opacity: 0, y: 12, filter: 'blur(6px)' });
      }
      if (scrollArrowRef.current) {
        gsap.set(scrollArrowRef.current, { opacity: 0, y: -10 });
      }

      const tl = gsap.timeline({ delay: 0.25 });

      // Navigation: subtle float-in
      if (navRef.current) {
        const navButtons = navRef.current.querySelectorAll('button');
        tl.fromTo(
          navButtons,
          { opacity: 0, y: -10, filter: 'blur(4px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.7,
            stagger: 0.08,
            ease: 'power2.out',
          },
          0
        );
      }

      // Title: left-to-right slow slide + reveal (clip-path)
      if (titleMaskRef.current && titleTextRef.current) {
        gsap.set(titleMaskRef.current, { willChange: 'clip-path, transform' });
        gsap.set(titleTextRef.current, { willChange: 'transform, filter' });

        tl.fromTo(
          titleMaskRef.current,
          // Slight negative insets prevent descenders/blur from clipping on all edges
          { clipPath: 'inset(0 100% -0.22em -0.18em)', x: -26 },
          {
            clipPath: 'inset(0 0% -0.22em -0.18em)',
            x: 0,
            duration: 1.4,
            ease: 'power3.out',
          },
          0.15
        );

        // Add a tiny parallax-like drift on the text itself
        tl.fromTo(
          titleTextRef.current,
          { x: -36, filter: 'blur(10px)' },
          {
            x: 0,
            filter: 'blur(0px)',
            duration: 1.6,
            ease: 'power3.out',
          },
          0.15
        );
      }

      // Subtitle: soft fade-up
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 10, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power2.out',
          },
          0.85
        );
      }

      // Scroll arrow: fade in and start bouncing
      if (scrollArrowRef.current) {
        tl.fromTo(
          scrollArrowRef.current,
          { opacity: 0, y: -10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          1.2
        );

        // Create slow bouncing animation
        gsap.to(scrollArrowRef.current, {
          y: 8,
          duration: 1.5,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
          delay: 2,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Magnetic cursor effect for nav buttons
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(button, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full bg-white overflow-hidden min-h-[100svh]"
    >
      {/* Subtle background pattern */}
      <HeroBackground />
      
      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-16 z-10 min-h-[100svh] flex flex-col">
        {/* Navigation (Figma: Work / About on left, Contact on right; mobile centered) */}
        <nav
          ref={navRef}
          className="flex items-start justify-between pt-6 md:pt-6 flex-shrink-0"
          aria-label="Primary"
        >
          <div className="hidden md:flex items-center gap-10">
            <button
              onClick={() => scrollToSection('projects')}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="opacity-0 text-[24px] font-light tracking-[1.2px] text-[rgba(0,0,0,0.68)] transition-opacity hover:opacity-70 cursor-pointer"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
              type="button"
            >
              Work
            </button>
            <button
              onClick={() => scrollToSection('about')}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="opacity-0 text-[24px] font-light tracking-[1.2px] text-[rgba(0,0,0,0.68)] transition-opacity hover:opacity-70 cursor-pointer"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
              type="button"
            >
              About
            </button>
          </div>

          <div className="md:hidden w-full flex items-center justify-center gap-8">
            <button
              onClick={() => scrollToSection('projects')}
              className="opacity-0 text-[11px] font-light tracking-[0.55px] text-[rgba(0,0,0,0.68)] transition-opacity hover:opacity-70 cursor-pointer"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
              type="button"
            >
              Work
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="opacity-0 text-[11px] font-light tracking-[0.55px] text-[rgba(0,0,0,0.68)] transition-opacity hover:opacity-70 cursor-pointer"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
              type="button"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="opacity-0 text-[11px] font-light tracking-[0.55px] text-[rgba(0,0,0,0.68)] transition-opacity hover:opacity-70 cursor-pointer"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
              type="button"
            >
              Contact
            </button>
          </div>

          <div className="hidden md:block">
            <button
              onClick={() => scrollToSection('contact')}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="opacity-0 mt-[23px] text-[24px] font-light tracking-[1.2px] text-[rgba(0,0,0,0.68)] transition-opacity hover:opacity-70 cursor-pointer"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
              type="button"
            >
              Contact
            </button>
          </div>
        </nav>

        {/* Hero content */}
        <div className="flex items-center justify-center flex-1 pb-20">
          <div className="w-full">
            <h1
              className="text-black text-center font-bold leading-[1] tracking-[-0.04em] pb-[0.06em]"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              <span
                ref={titleMaskRef}
                className="inline-block pb-[0.2em] px-[0.12em]"
                style={{ clipPath: 'inset(0 100% -0.24em -0.2em)' }}
              >
                <span ref={titleTextRef} className="inline-block">
                  James Petry.
                </span>
              </span>
            </h1>

            {/* Title sizing */}
            <style jsx>{`
              h1 {
                font-size: clamp(96px, 14vw, 220px);
              }
            `}</style>

            {/* Figma sizes: desktop 32px / tracking 1.6, mobile 16px / tracking 0.8 */}
            <p
              ref={subtitleRef}
              className="opacity-0 mt-4 md:mt-6 text-black text-center font-light leading-[normal]"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              <span className="hidden md:inline text-[32px] tracking-[1.6px]">
                Computational Designer
              </span>
              <span className="md:hidden text-[16px] tracking-[0.8px]">
                Computational Designer
              </span>
            </p>

            {/* Skills Indicator */}
            <SkillsIndicator />
          </div>
        </div>
      </div>

      {/* Scroll Arrow */}
      <button
        ref={scrollArrowRef}
        onClick={() => scrollToSection('projects')}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 opacity-0 flex flex-col items-center gap-2 text-black/60 hover:text-black/80 transition-colors duration-300 cursor-pointer group z-20"
        aria-label="Scroll to projects"
        type="button"
      >
        <span 
          className="text-xs tracking-[0.05em] uppercase"
          style={{ 
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 300,
            letterSpacing: '0.05em',
          }}
        >
          Scroll
        </span>
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          className="group-hover:opacity-80 transition-opacity"
          aria-hidden="true"
        >
          <path 
            d="m6 9 6 6 6-6" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </button>
    </section>
  );
}

