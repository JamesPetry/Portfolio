'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { IconType } from 'react-icons';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ContactButtonProps {
  icon: IconType;
  label: string;
  href: string;
  index: number;
}

export default function ContactButton({ icon: Icon, label, href, index }: ContactButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    gsap.fromTo(
      buttonRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: buttonRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, [index]);

  return (
    <Link
      ref={buttonRef}
      href={href}
      className="group relative flex items-center gap-4 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
        <Icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" />
      </div>
      <span className="text-body text-white/80 group-hover:text-white transition-colors duration-300">
        {label}
      </span>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-purple-500/5 transition-all duration-300" />
    </Link>
  );
}

