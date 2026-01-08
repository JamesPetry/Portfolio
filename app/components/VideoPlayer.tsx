'use client';

import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  className?: string;
  blendMode?: 'overlay' | 'screen' | 'multiply' | 'normal';
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
}

export default function VideoPlayer({
  src,
  className = '',
  blendMode = 'normal',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video && autoPlay) {
      video.play().catch((error) => {
        // Silently handle autoplay failures (common in browsers with autoplay restrictions)
        if (process.env.NODE_ENV === 'development') {
          console.error('Video autoplay failed:', error);
        }
      });
    }
  }, [autoPlay]);

  const blendClass = {
    overlay: 'blend-overlay',
    screen: 'blend-screen',
    multiply: 'blend-multiply',
    normal: '',
  }[blendMode];

  return (
    <video
      ref={videoRef}
      src={src}
      className={`${className} ${blendClass}`}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      preload="auto"
    />
  );
}

