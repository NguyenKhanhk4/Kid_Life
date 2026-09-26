export default function CloudShape({ className, width = 100, height = 50, color = "#FFFFFF" }: { className?: string, width?: number | string, height?: number | string, color?: string }) {
  return (
    <svg 
      className={className} 
      width={width} 
      height={height} 
      viewBox="0 0 100 50" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M25 40 C10 40, 5 25, 15 15 C20 10, 30 10, 35 15 C45 0, 70 0, 75 15 C85 10, 95 20, 90 30 C95 40, 80 40, 75 40 Z" 
        fill={color} 
        stroke="#2D2545" 
        strokeWidth="3" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}
