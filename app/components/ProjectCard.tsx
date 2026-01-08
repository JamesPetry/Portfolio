'use client';

import { useEffect, useRef, useState } from 'react';
import { Project } from '@/types/portfolio';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import 3D viewer and data viz to reduce initial bundle size
const Project3DViewer = dynamic(() => import('./Project3DViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/5">
      <div className="w-8 h-8 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
    </div>
  ),
});

const ProjectDataViz = dynamic(() => import('./ProjectDataViz'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/5 p-8">
      <div className="w-8 h-8 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
    </div>
  ),
});

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previousImageIndex, setPreviousImageIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set([0]));
  const [isTransitioning, setIsTransitioning] = useState(false);
   const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const transitionRef = useRef<gsap.core.Timeline | null>(null);
  const currentIndexRef = useRef(0);
  const transitioningRef = useRef(false);
  const preloadedRef = useRef<Set<number>>(new Set([0]));

  const isEven = index % 2 === 0;
  const showMoreLabel = 'Show More';
  const displayTitle = project.title.trim().endsWith('.') ? project.title.trim() : `${project.title.trim()}.`;
  const bleedSideClass = isEven
    ? 'lg:mr-[calc(50%-50vw)]'
    : 'lg:ml-[calc(50%-50vw)]';

  // Keep refs in sync (interval uses refs to avoid re-arming timers)
  useEffect(() => {
    currentIndexRef.current = currentImageIndex;
  }, [currentImageIndex]);

  useEffect(() => {
    transitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  useEffect(() => {
    preloadedRef.current = preloadedImages;
  }, [preloadedImages]);

  // Auto-advance images - only when not transitioning
  useEffect(() => {
    if (project.images.length <= 1) return;

    const interval = setInterval(() => {
      // Use refs so this interval is stable and cannot "double fire"
      if (transitioningRef.current) return;

      const nextIndex = (currentIndexRef.current + 1) % project.images.length;
      // Only transition if next image is preloaded
      if (preloadedRef.current.has(nextIndex)) {
        const from = currentIndexRef.current;
        currentIndexRef.current = nextIndex;
        transitioningRef.current = true;
        setIsTransitioning(true);
        setPreviousImageIndex(from);
        setCurrentImageIndex(nextIndex);
      }
    }, 5000); // Change image every 5 seconds (increased for smoother experience)

    return () => clearInterval(interval);
  }, [project.images.length]);

  // Preload all images when card enters viewport
  useEffect(() => {
    if (!cardRef.current) return;

    // Preload all images immediately when card enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            project.images.forEach((imageSrc, idx) => {
              if (!preloadedImages.has(idx)) {
                const img = new window.Image();
                img.src = imageSrc;
                img.onload = () => {
                  setPreloadedImages((prev) => new Set([...prev, idx]));
                };
                img.onerror = () => {
                  // Still mark as loaded to prevent blocking
                  setPreloadedImages((prev) => new Set([...prev, idx]));
                };
              }
            });
            observer.disconnect();
          }
        });
      },
      { rootMargin: '300px' } // Start loading 300px before entering viewport
    );

    observer.observe(cardRef.current);

    return () => {
      observer.disconnect();
    };
  }, [project.images, preloadedImages]);

  // Animate text on scroll
  useEffect(() => {
    if (!cardRef.current || !textRef.current) return;

    const animations: gsap.core.Tween[] = [];

    // Animate title
    if (titleRef.current) {
      animations.push(
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            x: isEven ? -50 : 50,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      );
    }

    // Animate tagline with type-on effect
    if (taglineRef.current) {
      const chars = taglineRef.current.querySelectorAll('[data-type-char]');
      if (chars.length > 0) {
      animations.push(
        gsap.fromTo(
            chars,
            { opacity: 0, y: 6 },
          {
            opacity: 1,
              y: 0,
              duration: 0.45,
              ease: 'none',
              stagger: 0.01,
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      );
      }
    }

    // Animate description with simple fade-up (no word-by-word)
    if (descRef.current) {
      animations.push(
        gsap.fromTo(
          descRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      );
    }

    // Animate image
    if (imageRef.current) {
      animations.push(
        gsap.fromTo(
          imageRef.current,
          {
            opacity: 0,
            y: 20,
            scale: 0.985,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      );

      // Subtle parallax on scroll
      animations.push(
        gsap.to(imageRef.current, {
          y: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      );
    }

    return () => {
      animations.forEach((anim) => {
        if (anim && anim.scrollTrigger) {
          anim.scrollTrigger.kill();
        }
      });
    };
  }, [index, isEven]);

  // Utility: resolve object position for an image index
  const resolveObjectPosition = (imgIndex: number) =>
    project.imagePositions?.[imgIndex] || 'center center';

  // Utility: apply object position to a single image element
  const applyObjectPosition = (imgIndex: number) => {
    if (!imageRef.current) return;
    const wrapperEl = imageRef.current.querySelector(`div[data-image-index="${imgIndex}"]`);
    const imgEl = wrapperEl?.querySelector('img');
    if (imgEl) {
      (imgEl as HTMLImageElement).style.objectPosition = resolveObjectPosition(imgIndex);
    }
  };

  // Utility: apply object position to all images
  const applyAllObjectPositions = () => {
    if (!imageRef.current || !project.imagePositions) return;
    project.images.forEach((_, imgIndex) => {
      applyObjectPosition(imgIndex);
    });
  };

  // Smooth crossfade transition - both images present during transition
  useEffect(() => {
    if (!imageRef.current || previousImageIndex === currentImageIndex) return;

    const imageWrappers = Array.from(
      imageRef.current.querySelectorAll<HTMLDivElement>('div[data-image-index]')
    );

    const resetVisualState = () => {
      imageWrappers.forEach((wrapper) => {
        const idx = Number(wrapper.dataset.imageIndex);
        const isCurrent = idx === currentIndexRef.current;
        wrapper.style.opacity = isCurrent ? '1' : '0';
        wrapper.style.zIndex = isCurrent ? '2' : '0';
        wrapper.style.transition = 'none';
      });
    };

    const prevWrapperElement = imageRef.current.querySelector(
      `div[data-image-index="${previousImageIndex}"]`
    ) as HTMLDivElement | null;
    const currentWrapperElement = imageRef.current.querySelector(
      `div[data-image-index="${currentImageIndex}"]`
    ) as HTMLDivElement | null;

    if (!prevWrapperElement || !currentWrapperElement) {
      resetVisualState();
      setIsTransitioning(false);
      transitioningRef.current = false;
      return;
    }

    // Kill any existing transition and normalize
    if (transitionRef.current) {
      transitionRef.current.kill();
      transitionRef.current = null;
      resetVisualState();
    }

    // Prep state
    gsap.killTweensOf(prevWrapperElement);
    gsap.killTweensOf(currentWrapperElement);
    imageWrappers.forEach((wrapper) => {
      wrapper.style.transition = 'none';
    });

    prevWrapperElement.style.zIndex = '1';
    prevWrapperElement.style.opacity = '1';
    currentWrapperElement.style.zIndex = '2';
    currentWrapperElement.style.opacity = '0';

    setIsTransitioning(true);
    transitioningRef.current = true;

    const tl = gsap.timeline({
      defaults: { duration: 1.1, ease: 'power1.inOut' },
      onComplete: () => {
        resetVisualState();
        setIsTransitioning(false);
        transitioningRef.current = false;
        transitionRef.current = null;
      },
    });

    tl.to(prevWrapperElement, { opacity: 0 }, 0).to(currentWrapperElement, { opacity: 1 }, 0);

    transitionRef.current = tl;
  }, [currentImageIndex, previousImageIndex]);

  // Reapply objectPosition when current image changes or after transitions
  useEffect(() => {
    if (!imageRef.current || !project.imagePositions) return;

    // Apply immediately
    applyAllObjectPositions();

    // Reapply after a short delay to catch any Next.js re-renders
    const timeoutId = setTimeout(applyAllObjectPositions, 100);

    return () => clearTimeout(timeoutId);
  }, [currentImageIndex, project.imagePositions, project.images]);

  // Guard against Next/Image mutations resetting object-position
  useEffect(() => {
    if (!imageRef.current || !project.imagePositions) return;

    applyAllObjectPositions();

    const observer = new MutationObserver(() => {
      applyAllObjectPositions();
    });

    observer.observe(imageRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => observer.disconnect();
  }, [project.imagePositions, project.images]);

  const handleImageChange = (newIndex: number) => {
    // Prevent manual changes during automatic transitions
    if (newIndex !== currentImageIndex && !transitioningRef.current && preloadedRef.current.has(newIndex)) {
      // Kill any ongoing transition
      if (transitionRef.current) {
        transitionRef.current.kill();
        transitionRef.current = null;
        setIsTransitioning(false);
        transitioningRef.current = false;
      }
      const from = currentIndexRef.current;
      currentIndexRef.current = newIndex;
      transitioningRef.current = true;
      setIsTransitioning(true);
      setPreviousImageIndex(from);
      setCurrentImageIndex(newIndex);
    }
  };

  return (
    <div
      ref={cardRef}
      className="relative w-full bg-white snap-start snap-always h-[100svh] flex items-stretch overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-[35px] h-full box-border py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 h-full items-stretch">
          {/* Text (Figma-inspired) */}
          <div
            ref={textRef}
            className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'} flex flex-col h-full`}
          >
            <h2
              ref={titleRef}
              className="text-black font-black leading-[1.02] tracking-[-0.05em] text-[44px] md:text-[56px] lg:text-[64px]"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {displayTitle}
            </h2>

            <p
              ref={taglineRef}
              className="mt-5 md:mt-6 text-black font-medium leading-[1.25] tracking-[-0.05em] text-[20px] md:text-[26px] lg:text-[32px] max-w-[26ch]"
              style={{ 
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                hyphens: 'none',
                WebkitHyphens: 'none',
                MozHyphens: 'none',
                msHyphens: 'none',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                wordBreak: 'normal'
              }}
            >
              {renderTypeText(project.tagline)}
            </p>

            <div className="mt-5 md:mt-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-black/70">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/5">
                  {/* clock */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
                <span className="text-[16px] md:text-[18px] lg:text-[20px] font-medium tracking-[-0.04em]">
                  {project.duration ?? project.year}
                </span>
              </div>

              {/* Enhanced Tool Tags */}
              {project.tools && project.tools.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool, toolIndex) => (
                    <span
                      key={toolIndex}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/5 hover:bg-black/10 rounded-full text-xs md:text-sm font-medium text-black/70 hover:text-black transition-colors cursor-default"
                      title={tool}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-black/40" />
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={`/projects/${project.id}`}
              className="mt-auto inline-flex items-center gap-3 text-[20px] md:text-[24px] lg:text-[32px] font-medium tracking-[-0.05em] text-black/70 hover:text-black transition-all duration-300 group pt-10"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {showMoreLabel}
              <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Media Display: 3D Viewer, Data Viz, or Images */}
          <div className={`lg:col-span-7 ${isEven ? 'lg:order-2' : 'lg:order-1'} ${bleedSideClass}`}>
            <div
              ref={imageRef}
              className="relative overflow-hidden bg-[#f5f5f5] h-[42vh] min-h-[360px] md:min-h-[440px] lg:h-full will-change-transform gpu-accelerated"
              style={{ borderRadius: 0 }}
            >
              {/* Show 3D viewer if model exists */}
              {project.model3D ? (
                <>
                  <Project3DViewer
                    modelUrl={project.model3D}
                    autoRotate={true}
                    enableControls={true}
                    className="absolute inset-0"
                  />
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20 text-black/90 bg-white/80 backdrop-blur px-3 py-1.5 rounded text-[14px] md:text-[16px] font-medium tracking-[-0.04em]">
                    {project.category}
                  </div>
                </>
              ) : project.visualizationData && typeof project.visualizationData.data === 'string' ? (
                /* Show data visualization if available */
                <>
                  <div className="absolute inset-0 overflow-y-auto">
                    <ProjectDataViz dataUrl={project.visualizationData.data as string} className="p-6" />
                  </div>
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20 text-black/90 bg-white/80 backdrop-blur px-3 py-1.5 rounded text-[14px] md:text-[16px] font-medium tracking-[-0.04em]">
                    {project.category}
                  </div>
                </>
              ) : (
                /* Default to images */
                <>
                  {project.images.map((imageSrc, imgIndex) => {
                    const isCurrent = imgIndex === currentImageIndex;
                    const isPrevious =
                      isTransitioning &&
                      previousImageIndex !== currentImageIndex &&
                      imgIndex === previousImageIndex;
                    const opacity = isCurrent ? 1 : isPrevious ? 1 : 0;
                    const zIndex = isCurrent ? 2 : isPrevious ? 1 : 0;
                    // Get individual image position, default to 'center center' if not specified
                    const objectPosition = resolveObjectPosition(imgIndex);

                    return (
                      <div
                        key={imgIndex}
                        data-image-index={imgIndex}
                        className="absolute inset-0"
                        style={{ 
                          opacity, 
                          zIndex, 
                          pointerEvents: 'none', 
                          transition: 'none'
                        }}
                      >
                        <Image
                        src={imageSrc}
                        alt={`${project.title} - Image ${imgIndex + 1}`}
                        fill
                          className="object-cover"
                          style={{ 
                            objectPosition: objectPosition
                          }}
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        unoptimized
                        quality={95}
                        loading={index === 0 && imgIndex === 0 ? 'eager' : 'lazy'}
                        priority={index === 0 && imgIndex === 0}
                          onLoadingComplete={() => {
                            setLoadedImages((prev) => new Set([...prev, imgIndex]));
                            // Apply objectPosition directly to the img element to override Next.js defaults
                            requestAnimationFrame(() => applyObjectPosition(imgIndex));
                          }}
                      />
                      </div>
                    );
                  })}

                  {!loadedImages.has(currentImageIndex) && (
                    <div className="absolute inset-0 z-[3] bg-gradient-to-r from-black/[0.04] via-black/[0.02] to-black/[0.04] animate-pulse" />
                  )}

                  <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20 text-white/90 text-[14px] md:text-[16px] font-medium tracking-[-0.04em]">
                    {project.category}
                  </div>

                  {project.images.length > 1 && (
                    <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur">
                      <span className="text-xs text-black/60">
                        {currentImageIndex + 1} / {project.images.length}
                      </span>
                      {project.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handleImageChange(i)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            i === currentImageIndex ? 'w-14 bg-black' : 'w-3 bg-black/40 hover:bg-black/70'
                          }`}
                          aria-label={`View image ${i + 1} of ${project.images.length}`}
                          type="button"
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function truncateDescription(text: string, wordLimit = 42) {
  const words = text.split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(' ') + '…';
}

function renderTypeText(text: string) {
  const words = text.split(/\s+/);
  return words.map((word, wordIndex, array) => (
    <span key={`word-${wordIndex}`}>
      <span className="inline-block" style={{ whiteSpace: 'nowrap' }}>
        {Array.from(word).map((ch, charIndex) => (
          <span
            key={`${wordIndex}-${charIndex}`}
            data-type-char
            className="inline-block"
            style={{
              opacity: 0,
            }}
          >
            {ch}
          </span>
        ))}
      </span>
      {wordIndex < array.length - 1 && (
        <span className="inline-block" style={{ width: '0.25em' }} aria-hidden="true">
          {' '}
        </span>
      )}
    </span>
  ));
}

