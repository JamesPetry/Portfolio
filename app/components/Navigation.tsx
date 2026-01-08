'use client';

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          <Link 
            href="/" 
            className="px-4 py-2 rounded-lg bg-gray-100 text-black text-sm font-medium transition-colors hover:bg-gray-200"
          >
            Home
          </Link>
          <Link 
            href="#projects" 
            className="px-4 py-2 text-gray-700 text-sm font-medium transition-colors hover:text-black"
          >
            Projects
          </Link>
          <Link 
            href="#about" 
            className="px-4 py-2 text-gray-700 text-sm font-medium transition-colors hover:text-black"
          >
            About
          </Link>
        </div>
        <Link 
          href="#contact" 
          className="px-4 py-2 text-gray-700 text-sm font-medium transition-colors hover:text-black"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}

