'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ToolProficiencyProps {
  className?: string;
}

// Logo data - paths to black logo images
// Logo files should be in public/logos/ directory
// Supported formats: SVG, PNG (black/grayscale logos work best)
const logos = [
  { name: 'Grasshopper', path: '/logos/grasshopper.svg', url: 'https://www.grasshopper3d.com/' },
  { name: 'Rhino', path: '/logos/rhino.svg', url: 'https://www.rhino3d.com/' },
  { name: 'Python', path: '/logos/python.svg', url: 'https://www.python.org/' },
  { name: 'React', path: '/logos/react.svg', url: 'https://react.dev/' },
  { name: 'Blender', path: '/logos/blender.svg', url: 'https://www.blender.org/' },
  { name: 'Cursor', path: '/logos/cursor.svg', url: 'https://www.cursor.sh/' },
  { name: 'VSCode', path: '/logos/vscode.svg', url: 'https://code.visualstudio.com/' },
  { name: 'ChatGPT', path: '/logos/chatgpt.svg', url: 'https://openai.com/' },
];

export default function ToolProficiency({ className = '' }: ToolProficiencyProps) {
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());
  
  // Duplicate logos for seamless infinite scroll (2 copies for seamless loop)
  const duplicatedLogos = [...logos, ...logos];

  const handleImageError = (logoName: string) => {
    setFailedLogos((prev) => new Set(prev).add(logoName));
  };

  return (
    <div className={`w-full ${className}`}>
      <h3 className="text-black/70 text-center font-medium tracking-[-0.04em] text-[14px] md:text-[16px] mb-4 md:mb-5">
        Tools & Technologies
      </h3>
      
      {/* Infinite scrolling carousel */}
      <div className="relative w-full overflow-hidden py-2">
        {/* Left fade gradient */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-16 md:w-24 lg:w-32 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 0) 100%)',
          }}
        />
        {/* Right fade gradient */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-16 md:w-24 lg:w-32 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 0) 100%)',
          }}
        />
        <div className="flex animate-scroll-infinite gap-10 md:gap-14 lg:gap-20 items-center will-change-transform">
          {duplicatedLogos.map((logo, index) => (
            <a
              key={`${logo.name}-${index}`}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center justify-center h-12 md:h-16 lg:h-20 opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              aria-label={`Visit ${logo.name} website`}
            >
              {failedLogos.has(logo.name) ? (
                // Fallback to styled text if image fails to load
                <span 
                  className="text-black text-xs md:text-sm lg:text-base font-medium whitespace-nowrap tracking-tight"
                  style={{ 
                    fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  {logo.name}
                </span>
              ) : (
                <div className="relative w-auto h-full flex items-center">
                  <Image
                    src={logo.path}
                    alt={logo.name}
                    width={80}
                    height={80}
                    className="h-full w-auto object-contain"
                    style={{ 
                      filter: 'brightness(0)',
                    }}
                    unoptimized
                    onError={() => handleImageError(logo.name)}
                  />
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
