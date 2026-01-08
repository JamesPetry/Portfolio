'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black" style={{ 
          fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          Something went wrong!
        </h2>
        <p className="text-black/60 mb-6" style={{ 
          fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-black text-white rounded-lg hover:opacity-80 transition-opacity"
          style={{ 
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
