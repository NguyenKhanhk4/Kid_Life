export default function FlameAccent({ className, width = 80, height = 60 }: { className?: string, width?: number | string, height?: number | string }) {
  return (
    <svg 
      className={className} 
      width={width} 
      height={height} 
      viewBox="0 0 80 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M10 30 C30 10, 50 5, 70 20 C60 25, 65 40, 75 45 C55 55, 30 50, 10 30 Z" 
        fill="#FF7043" 
        stroke="#2D2545" 
        strokeWidth="3" 
        strokeLinejoin="round" 
      />
      <path 
        d="M20 30 C35 20, 50 18, 60 28 C55 30, 58 38, 65 40 C50 48, 35 45, 20 30 Z" 
        fill="#FFCA28" 
        stroke="#2D2545" 
        strokeWidth="2" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}
