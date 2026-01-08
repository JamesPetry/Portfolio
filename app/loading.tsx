export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-pulse text-lg text-black/60" style={{ 
          fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          Loading...
        </div>
      </div>
    </div>
  );
}
