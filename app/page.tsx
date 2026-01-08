'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import About from './components/About';
import Footer from './components/Footer';
import ScrollIndicator from './components/ScrollIndicator';
import { projects } from '@/lib/projects';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  useEffect(() => {
    // Refresh ScrollTrigger on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className="relative w-full bg-white snap-y snap-mandatory [scroll-snap-stop:always]">
      <ScrollIndicator />
      <div id="hero" className="snap-start">
        <Hero />
      </div>
      <div id="projects" className="snap-start">
        <Portfolio projects={projects} />
      </div>
      <div id="about" className="snap-start">
        <About />
      </div>
      <div id="contact" className="snap-start"></div>
      <Footer />
    </main>
  );
}

