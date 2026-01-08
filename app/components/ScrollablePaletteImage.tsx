'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

interface ScrollablePaletteImageProps {
  src: string;
  alt: string;
}

export default function ScrollablePaletteImage({ src, alt }: ScrollablePaletteImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);
  const [currentScroll, setCurrentScroll] = useState(0);
  const lastMouseYRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const updateMaxScroll = () => {
      if (imageRef.current && containerRef.current) {
        const imageHeight = imageRef.current.scrollHeight;
        const containerHeight = containerRef.current.clientHeight;
        setMaxScroll(Math.max(0, imageHeight - containerHeight));
      }
    };

    // Wait for image to load
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setTimeout(updateMaxScroll, 100);
    };
    
    updateMaxScroll();
    window.addEventListener('resize', updateMaxScroll);
    return () => {
      window.removeEventListener('resize', updateMaxScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [src]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imageRef.current || maxScroll <= 0 || !isHovering) return;

    const rect = containerRef.current.getBoundingClientRect();
    const currentMouseY = e.clientY - rect.top;
    
    // Calculate delta from last position
    const deltaY = currentMouseY - lastMouseYRef.current;
    lastMouseYRef.current = currentMouseY;

    // Scroll speed multiplier (adjust for sensitivity)
    const scrollSpeed = 2;
    const scrollDelta = deltaY * scrollSpeed;

    // Update scroll position
    setCurrentScroll((prev) => {
      const newScroll = Math.max(0, Math.min(maxScroll, prev + scrollDelta));
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        if (imageRef.current) {
          imageRef.current.style.transform = `translateY(-${newScroll}px)`;
        }
      });
      
      return newScroll;
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovering(true);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      lastMouseYRef.current = e.clientY - rect.top;
    }
    if (imageRef.current) {
      imageRef.current.style.transition = '';
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    lastMouseYRef.current = 0;
    if (imageRef.current) {
      imageRef.current.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      imageRef.current.style.transform = 'translateY(0)';
      setCurrentScroll(0);
      setTimeout(() => {
        if (imageRef.current) {
          imageRef.current.style.transition = '';
        }
      }, 800);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden cursor-ns-resize bg-white"
      style={{ height: '70vh', minHeight: '600px', maxHeight: '900px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={imageRef}
        className="absolute top-0 left-0 w-full"
        style={{
          willChange: 'transform',
          transform: 'translateY(0)',
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={3000}
          className="w-full h-auto object-contain"
          style={{ 
            pointerEvents: 'none',
            display: 'block',
            width: '100%',
            height: 'auto',
          }}
          quality={100}
          unoptimized
        />
      </div>
      {isHovering && maxScroll > 0 && (
        <div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm pointer-events-none z-10"
          style={{ 
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 400,
            letterSpacing: '0.02em',
          }}
        >
          Move mouse up/down to scroll
        </div>
      )}
    </div>
  );
}
