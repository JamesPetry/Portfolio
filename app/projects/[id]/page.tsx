'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { HiArrowUp } from 'react-icons/hi';
import { projects } from '@/lib/projects';
import ScrollablePaletteImage from '@/app/components/ScrollablePaletteImage';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
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

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = parseInt(params.id as string);
  const project = projects.find((p) => p.id === projectId);
  const pageRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const bottomLeftRef = useRef<HTMLDivElement>(null);
  const backToTopRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) {
      router.push('/');
      return;
    }
  }, [project, router]);

  useEffect(() => {
    if (!pageRef.current || !project) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pageRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll('[data-type-char]');
        tl.fromTo(
          chars,
          { opacity: 0, y: 10, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out', stagger: 0.012 },
          0
        );
      }

      if (taglineRef.current) {
        const chars = taglineRef.current.querySelectorAll('[data-type-char]');
        tl.fromTo(
          chars,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'none', stagger: 0.006 },
          0.2
        );
      }

      if (bottomBarRef.current) {
        tl.fromTo(
          bottomBarRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
          0.85
        );

        const bottomChars = bottomBarRef.current.querySelectorAll('[data-type-char]');
        gsap.fromTo(
          bottomChars,
          { opacity: 0, y: 6 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'none',
            stagger: 0.012,
            scrollTrigger: {
              trigger: bottomBarRef.current,
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, [project]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!project) {
    return null;
  }

  const displayTitle = project.title.trim().endsWith('.') ? project.title.trim() : `${project.title.trim()}.`;

  // Special layout for Project 1
  if (project.id === 1) {
    return (
      <main ref={pageRef} className="relative w-full bg-white min-h-screen">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-black/10">
          <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-16 py-4 md:py-6">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-[24px] tracking-[1.2px] text-[rgba(0,0,0,0.68)] hover:opacity-70 transition-opacity"
                style={{ 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 300,
                  letterSpacing: '0.05em',
                }}
              >
                ← Back to Home
              </Link>
              <div 
                className="text-[24px] tracking-[1.2px] text-[rgba(0,0,0,0.68)]"
                style={{ 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 300,
                  letterSpacing: '0.05em',
                }}
              >
                {project.category}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section - Full bleed viewport image with text overlay */}
        <section className="relative w-full h-screen min-h-[100vh] overflow-hidden">
          {project.images && project.images.length > 0 && (
            <>
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={project.images[0]}
                  alt={`${project.title} - Hero`}
                  fill
                  className="object-cover"
                  quality={95}
                  unoptimized
                  priority
                />
              </div>
              {/* Black opacity gradient overlay at top for text emphasis */}
              <div 
                className="absolute inset-0 w-full h-full"
                style={{
                  background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 30%, rgba(0, 0, 0, 0) 60%)',
                }}
              />
              {/* Inner shadow effect at top */}
              <div 
                className="absolute top-0 left-0 right-0 h-[40%] pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at top, rgba(0, 0, 0, 0.3) 0%, transparent 70%)',
                }}
              />
            </>
          )}
          <div className="relative z-10 h-full flex flex-col justify-start pt-24 md:pt-32">
            <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-16">
              <h1
                ref={titleRef}
                className="text-white leading-[1.02] tracking-[-0.05em] text-[48px] md:text-[64px] lg:text-[80px] mb-6 drop-shadow-lg"
                style={{ 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 900,
                  letterSpacing: '-0.05em',
                  textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)',
                }}
              >
                {renderTypeText(displayTitle)}
              </h1>
              <p
                ref={taglineRef}
                className="text-white leading-[1.35] tracking-[-0.02em] text-[20px] md:text-[24px] lg:text-[28px] max-w-[900px] drop-shadow-lg"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)',
                  hyphens: 'none',
                  WebkitHyphens: 'none',
                  MozHyphens: 'none',
                  msHyphens: 'none',
                  overflowWrap: 'break-word',
                  wordWrap: 'break-word',
                  wordBreak: 'normal',
                }}
              >
                {renderTypeText(project.tagline)}
              </p>
            </div>
          </div>
        </section>

        {/* Results Section - Left text, right full-bleed image */}
        <section className="relative pt-12 md:pt-16 pb-16 md:pb-24 bg-white overflow-hidden">
          <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-16">
            {/* UI/UX Design Label - Integrated at top */}
            <div className="mb-8 md:mb-12">
              <p 
                className="text-black/60 text-[11px] md:text-[12px] tracking-[0.08em] uppercase"
                style={{ 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 300,
                  letterSpacing: '0.08em',
                }}
              >
                UI/UX Design
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <h2 
                  className="text-black leading-[1.08] tracking-[-0.05em] text-[36px] md:text-[44px] lg:text-[52px] mb-5 md:mb-6"
                  style={{ 
                    fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: 900,
                    letterSpacing: '-0.05em',
                  }}
                >
                  Results
                </h2>
                {project.description && (
                  <div 
                    className="space-y-3.5 text-black/75 text-[15px] md:text-[17px] lg:text-[18px] leading-[1.65]"
                    style={{ 
                      fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                      fontWeight: 400,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    <p>A semantic product discovery system that surfaces rich product data, sustainability insights, and related alternatives.</p>
                    <p>Supports on-demand 3D model generation from product images using a Meshy Ai API and intelligently recommends similar products using hybrid search for fast, relevant comparison.</p>
                  </div>
                )}
              </div>
              {project.images && project.images.length > 1 && (
                <div className="lg:col-span-7 lg:col-start-6 relative w-full lg:w-[calc(100%+50vw-636px)] lg:max-w-none">
                  <div className="relative w-full">
                    <Image
                      src={project.images[1]}
                      alt={`${project.title} - Results`}
                      width={1920}
                      height={1080}
                      className="w-full h-auto object-cover"
                      style={{ 
                        display: 'block',
                        width: '100%',
                        height: 'auto',
                      }}
                      quality={95}
                      unoptimized
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Material Palette Builder Section - Left image, right text */}
        <section className="pt-16 md:pt-20 pb-16 md:pb-24 bg-white">
          <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="relative w-full">
                <ScrollablePaletteImage
                  src="/data/project 1 photos/product-aware-palette-2025-12-25.png"
                  alt="Product Aware Color Palette"
                />
              </div>
              <div>
                <h2 
                  className="text-black leading-[1.08] tracking-[-0.05em] text-[36px] md:text-[44px] lg:text-[52px] mb-5 md:mb-6"
                  style={{ 
                    fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: 900,
                    letterSpacing: '-0.05em',
                  }}
                >
                  Material Palette Builder
                </h2>
                <p 
                  className="text-black/75 text-[15px] md:text-[17px] lg:text-[18px] leading-[1.65]"
                  style={{ 
                    fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: 400,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Automatically extracts color palettes from product images, enabling users to build and export
                  multi-product palettes. Provides semantic color analysis, usage recommendations, and downloadable
                  PDFs with swatches, values, and design-ready metadata.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Bar */}
        <div
          ref={bottomBarRef}
          className="w-full border-t border-black/10 pt-3 md:pt-4 pb-3 md:pb-4 mt-16"
        >
          <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-16">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex items-center">
                <div
                  ref={bottomLeftRef}
                  className="text-black tracking-[-0.05em] text-[18px] md:text-[20px] lg:text-[24px]"
                  style={{ 
                    fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: 900,
                    letterSpacing: '-0.05em',
                  }}
                >
                  {renderTypeText('James Petry.')}
                </div>
              </div>

              <button
                ref={backToTopRef}
                onClick={scrollToTop}
                type="button"
                className="flex-none flex items-center gap-2 text-black tracking-[-0.04em] text-[16px] md:text-[18px] lg:text-[20px] hover:opacity-70 transition-opacity"
                style={{ 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 500,
                  letterSpacing: '-0.04em',
                }}
                aria-label="Back to top"
              >
                <span className="inline-flex">{renderTypeText('Back To Top')}</span>
                <HiArrowUp className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <div className="flex-1" aria-hidden />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Default layout for other projects
  return (
    <main ref={pageRef} className="relative w-full bg-white min-h-screen">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-black/10">
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-16 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-[24px] tracking-[1.2px] text-[rgba(0,0,0,0.68)] hover:opacity-70 transition-opacity"
              style={{ 
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 300,
                letterSpacing: '0.05em',
              }}
            >
              ← Back to Home
            </Link>
            <div 
              className="text-[24px] tracking-[1.2px] text-[rgba(0,0,0,0.68)]"
              style={{ 
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 300,
                letterSpacing: '0.05em',
              }}
            >
              {project.category}
            </div>
          </div>
        </div>
      </nav>

      {/* Title Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 bg-white">
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-16">
          <h1
            ref={titleRef}
            className="text-black leading-[1.02] tracking-[-0.05em] text-[48px] md:text-[64px] lg:text-[80px] mb-6"
            style={{ 
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 900,
              letterSpacing: '-0.05em',
            }}
          >
            {renderTypeText(displayTitle)}
          </h1>
          <p
            ref={taglineRef}
            className="text-black leading-[1.35] tracking-[-0.02em] text-[20px] md:text-[24px] lg:text-[28px] max-w-[900px]"
            style={{
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              hyphens: 'none',
              WebkitHyphens: 'none',
              MozHyphens: 'none',
              msHyphens: 'none',
              overflowWrap: 'break-word',
              wordWrap: 'break-word',
              wordBreak: 'normal',
            }}
          >
            {renderTypeText(project.tagline)}
          </p>
        </div>
      </section>

      {/* Additional Images Section - For other projects */}
      {project.id !== 1 && project.images && project.images.length > 2 && (
        <section className="py-0 bg-white">
          <div className="w-full">
            {project.images.slice(2).map((imageSrc, index) => (
              <div key={index} className="relative w-full">
                <Image
                  src={imageSrc}
                  alt={`${project.title} - Image ${index + 3}`}
                  width={1920}
                  height={1080}
                  className="w-full h-auto object-cover"
                  style={{ 
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                  }}
                  quality={95}
                  unoptimized
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Bar */}
      <div
        ref={bottomBarRef}
        className="w-full border-t border-black/10 pt-3 md:pt-4 pb-3 md:pb-4 mt-16"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-16">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center">
              <div
                ref={bottomLeftRef}
                className="text-black tracking-[-0.05em] text-[18px] md:text-[20px] lg:text-[24px]"
                style={{ 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 900,
                  letterSpacing: '-0.05em',
                }}
              >
                {renderTypeText('James Petry.')}
              </div>
            </div>

            <button
              ref={backToTopRef}
              onClick={scrollToTop}
              type="button"
              className="flex-none flex items-center gap-2 text-black tracking-[-0.04em] text-[16px] md:text-[18px] lg:text-[20px] hover:opacity-70 transition-opacity"
              style={{ 
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 500,
                letterSpacing: '-0.04em',
              }}
              aria-label="Back to top"
            >
              <span className="inline-flex">{renderTypeText('Back To Top')}</span>
              <HiArrowUp className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <div className="flex-1" aria-hidden />
          </div>
        </div>
      </div>
    </main>
  );
}
