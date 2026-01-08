'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HiArrowUp } from 'react-icons/hi';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const backToTopRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!footerRef.current || !backToTopRef.current) return;

    // Animate footer elements on scroll
    gsap.fromTo(
      footerRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Animate back to top button
    gsap.fromTo(
      backToTopRef.current,
      {
        opacity: 0,
        scale: 0.8,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  const scrollToTop = () => {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-white border-t border-black/5 py-8 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright - Bottom Left */}
        <div className="text-black/60 text-sm md:text-base" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
          © {new Date().getFullYear()} James Petry
        </div>

        {/* Back to Top - Bottom Center */}
        <button
          ref={backToTopRef}
          onClick={scrollToTop}
          className="flex items-center gap-2 text-black/60 hover:text-black transition-colors duration-300 text-sm md:text-base group"
          style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
          aria-label="Back to top"
        >
          <span>Back to top</span>
          <HiArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      </div>
    </footer>
  );
}

