export default function FlowerAccent({ className, width = 60, height = 60 }: { className?: string, width?: number | string, height?: number | string }) {
  return (
    <svg 
      className={className} 
      width={width} 
      height={height} 
      viewBox="0 0 60 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Leaf */}
      <path d="M30 45 C40 30, 50 35, 45 45 C40 55, 30 50, 30 45 Z" fill="#81C784" stroke="#2D2545" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Petals */}
      <circle cx="30" cy="20" r="10" fill="#FFB74D" stroke="#2D2545" strokeWidth="2.5" />
      <circle cx="20" cy="30" r="10" fill="#FFB74D" stroke="#2D2545" strokeWidth="2.5" />
      <circle cx="40" cy="30" r="10" fill="#FFB74D" stroke="#2D2545" strokeWidth="2.5" />
      <circle cx="30" cy="40" r="10" fill="#FFB74D" stroke="#2D2545" strokeWidth="2.5" />
      {/* Center */}
      <circle cx="30" cy="30" r="8" fill="#FFF59D" stroke="#2D2545" strokeWidth="2.5" />
      {/* Tiny face */}
      <circle cx="27" cy="29" r="1.5" fill="#2D2545" />
      <circle cx="33" cy="29" r="1.5" fill="#2D2545" />
      <path d="M28 33 Q 30 35 32 33" stroke="#2D2545" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
