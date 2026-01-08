'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const skills = ['3D Design', 'Systems Analysis', 'API Integration'];

export default function SkillsIndicator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSkill, setCurrentSkill] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSkill((prev) => (prev + 1) % skills.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          delay: 2, // Appear after title animation
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const skillElements = containerRef.current?.querySelectorAll('[data-skill]');
    if (skillElements) {
      skillElements.forEach((el, index) => {
        gsap.to(el, {
          opacity: index === currentSkill ? 1 : 0.3,
          scale: index === currentSkill ? 1 : 0.95,
          duration: 0.5,
          ease: 'power2.out',
        });
      });
    }
  }, [currentSkill]);

  return (
    <div
      ref={containerRef}
      className="opacity-0 flex items-center justify-center gap-4 mt-8 md:mt-12"
    >
      {skills.map((skill, index) => (
        <span
          key={index}
          data-skill
          className="text-sm md:text-base text-black/50 font-light tracking-[0.5px] transition-all"
        >
          {skill}
          {index < skills.length - 1 && <span className="mx-2 text-black/20">•</span>}
        </span>
      ))}
    </div>
  );
}
