export default function SunShape({ className, width = 90, height = 90 }: { className?: string, width?: number | string, height?: number | string }) {
  return (
    <svg 
      className={className} 
      width={width} 
      height={height} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sun glow */}
      <circle cx="50" cy="50" r="40" fill="rgba(255, 215, 0, 0.3)" filter="url(#sun-blur)" />
      {/* Sun rays */}
      <path d="M50 5 L50 20 M50 80 L50 95 M5 50 L20 50 M80 50 L95 50 M18 18 L28 28 M72 72 L82 82 M18 82 L28 72 M72 28 L82 18" stroke="#FFCA28" strokeWidth="6" strokeLinecap="round" />
      {/* Sun body */}
      <circle cx="50" cy="50" r="25" fill="#FFD700" stroke="#2D2545" strokeWidth="4" />
      {/* Cute face */}
      <circle cx="42" cy="45" r="3" fill="#2D2545" />
      <circle cx="58" cy="45" r="3" fill="#2D2545" />
      <path d="M45 52 Q 50 57 55 52" stroke="#2D2545" strokeWidth="3" strokeLinecap="round" fill="none" />
      
      <defs>
        <filter id="sun-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
    </svg>
  );
}
