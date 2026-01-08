'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SkillData } from '@/types/portfolio';

interface SkillMatrixProps {
  skills?: SkillData[];
  className?: string;
}

// Default skills data - Condensed to key skills
const defaultSkills: SkillData[] = [
  { name: 'Parametric Design', proficiency: 0.95, category: 'Design' },
  { name: 'Algorithmic Design', proficiency: 0.93, category: 'Design' },
  { name: 'User-Centered Design', proficiency: 0.92, category: 'Design' },
  { name: 'API Integration', proficiency: 0.88, category: 'Development' },
];

export default function SkillMatrix({ skills = defaultSkills, className = '' }: SkillMatrixProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!skillsRef.current) return;

    const skillItems = skillsRef.current.querySelectorAll('[data-skill-item]');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        skillItems,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: skillsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, skillsRef);

    return () => ctx.revert();
  }, []);

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <h3 className="text-black/70 text-center font-medium tracking-[-0.04em] text-[14px] md:text-[16px] mb-3">
        Skills & Expertise
      </h3>
      <div ref={skillsRef} className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 max-w-4xl mx-auto">
        {skills.map((skill, index) => (
          <div
            key={index}
            data-skill-item
            className="opacity-0 bg-black/5 px-3 py-2 rounded hover:bg-black/10 transition-colors"
          >
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-medium text-black/80 leading-tight">{skill.name}</span>
              <span className="text-[10px] md:text-xs text-black/50 mt-0.5">{skill.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
