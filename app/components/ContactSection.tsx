'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const icons = sectionRef.current.querySelectorAll('a');
    icons.forEach((icon, index) => {
      gsap.fromTo(
        icon,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: index * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, []);

  const allLinks = [
    { icon: PhoneIcon, href: 'tel:0423624863', label: 'Call 0423624863' },
    { icon: MailIcon, href: 'mailto:jamespetrytb@gmail.com', label: 'Email jamespetrytb@gmail.com' },
    { icon: GithubIcon, href: 'https://github.com/JamesPetry', label: 'GitHub JamesPetry' },
  ];

  return (
    <div ref={sectionRef} className="flex flex-wrap justify-center gap-10 md:gap-12">
      {allLinks.map((link, index) => {
        const Icon = link.icon;
        return (
          <a
            key={index}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 transition-transform duration-300 hover:scale-110 opacity-0"
            aria-label={link.label}
          >
            <Icon className="w-9 h-9 md:w-10 md:h-10 text-black/70 group-hover:text-black transition-colors duration-300" />
          </a>
        );
      })}
    </div>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 16.9v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.08 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.57-1.07a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.9Z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 4h16v16H4V4Z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 19c-4 1.5-4-2.5-5-3m10 6v-3.2c0-.9.3-1.6.8-2-2.7-.3-5.5-1.3-5.5-6A4.7 4.7 0 0 1 6.5 7.5 4.4 4.4 0 0 1 6.6 4s1-.3 3.4 1.3a11.6 11.6 0 0 1 6 0C18.4 3.7 19.4 4 19.4 4a4.4 4.4 0 0 1 .1 3.5 4.7 4.7 0 0 1 1.2 3.3c0 4.7-2.8 5.7-5.5 6 .5.4.8 1.2.8 2.3V22"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

