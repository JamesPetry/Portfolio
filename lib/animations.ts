import { gsap, ScrollTrigger } from './gsap';

export function fadeInUp(element: HTMLElement | string, delay: number = 0) {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 60,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      delay,
      ease: 'power3.out',
    }
  );
}

export function parallaxText(element: HTMLElement | string, speed: number = 0.5) {
  return gsap.to(element, {
    y: (i, el) => {
      return ScrollTrigger.maxScroll(window) * speed;
    },
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

export function videoBlend(element: HTMLElement | string, opacityStart: number = 0.3, opacityEnd: number = 1) {
  return gsap.to(element, {
    opacity: opacityEnd,
    scrollTrigger: {
      trigger: element,
      start: 'top center',
      end: 'bottom center',
      scrub: true,
    },
  });
}

export function sectionTransition(element: HTMLElement | string) {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.95,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );
}

export function splitTextAnimation(element: HTMLElement | string) {
  const text = typeof element === 'string' 
    ? document.querySelector(element)?.textContent || ''
    : element.textContent || '';
  
  const words = text.split(' ');
  const parent = typeof element === 'string' 
    ? document.querySelector(element) as HTMLElement
    : element;
  
  if (!parent) return;
  
  parent.innerHTML = words
    .map((word, i) => `<span class="word" style="display: inline-block; opacity: 0;" data-index="${i}">${word}</span>`)
    .join(' ');
  
  const wordElements = parent.querySelectorAll('.word');
  
  return gsap.to(wordElements, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.05,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: parent,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
}

