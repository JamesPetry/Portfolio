import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  
  // Optimize GSAP for performance
  gsap.config({
    nullTargetWarn: false,
  });
  
  // Set default ease for smoother animations
  gsap.defaults({
    ease: 'power2.out',
  });
}

export { gsap, ScrollTrigger };

