'use client';

'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

export default function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState('hero');
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScrollProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = Math.min(scrollTop / (documentHeight - windowHeight), 1);
      setScrollProgress(progress);

      // Determine current section
      const sections = ['hero', 'projects', 'about', 'contact'];
      const sectionIndex = Math.floor((scrollTop / (documentHeight - windowHeight)) * sections.length);
      const section = sections[Math.min(sectionIndex, sections.length - 1)] || 'hero';
      if (section !== currentSection) {
        setCurrentSection(section);
      }
    };

    const handleScroll = () => {
      requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection]);

  useEffect(() => {
    if (indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        width: `${scrollProgress * 100}%`,
        duration: 0.1,
        ease: 'none',
      });
    }
  }, [scrollProgress]);

  return (
    <div className="fixed top-0 left-0 w-full h-0.5 bg-black/5 z-50 backdrop-blur-sm">
      <div
        ref={indicatorRef}
        className="h-full bg-black/80 transition-opacity duration-300"
        style={{ width: '0%' }}
      />
    </div>
  );
}


