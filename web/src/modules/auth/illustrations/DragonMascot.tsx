export default function DragonMascot({ className, width = 160, height = 160, isSad = false }: { className?: string, width?: number | string, height?: number | string, isSad?: boolean }) {
  const strokeColor = "#2D2545";
  const strokeWidth = 6;
  const mainColor = "#4CAF50"; // Green
  const bellyColor = "#FFF59D"; // Yellow/Cream
  const spikeColor = "#FF7043"; // Orange

  return (
    <svg 
      className={className} 
      width={width} 
      height={height} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow */}
      <ellipse cx="100" cy="185" rx="65" ry="12" fill="rgba(0,0,0,0.15)" filter="url(#dragon-shadow-blur)" />
      
      {/* Tail */}
      <path 
        d="M60 140 C 20 160, 40 180, 80 170 C 60 160, 60 150, 60 140 Z" 
        fill={mainColor} 
        stroke={strokeColor} 
        strokeWidth={strokeWidth} 
        strokeLinejoin="round" 
      />

      {/* Spikes on back */}
      <path d="M45 80 L 25 85 L 40 100 Z" fill={spikeColor} stroke={strokeColor} strokeWidth="4" strokeLinejoin="round" />
      <path d="M40 110 L 20 115 L 35 130 Z" fill={spikeColor} stroke={strokeColor} strokeWidth="4" strokeLinejoin="round" />
      <path d="M45 140 L 25 145 L 45 155 Z" fill={spikeColor} stroke={strokeColor} strokeWidth="4" strokeLinejoin="round" />

      {/* Main Body */}
      <path 
        d="M70 175 C 30 175, 40 100, 55 70 C 65 50, 80 40, 100 40 C 130 40, 160 50, 160 85 C 160 110, 130 120, 130 140 C 130 160, 140 175, 140 175 C 140 175, 110 175, 70 175 Z" 
        fill={mainColor} 
        stroke={strokeColor} 
        strokeWidth={strokeWidth} 
        strokeLinejoin="round" 
      />

      {/* Belly */}
      <path 
        d="M70 175 C 50 175, 60 120, 70 95 C 80 70, 95 60, 105 60 C 120 60, 135 70, 135 95 C 135 115, 110 130, 110 145 C 110 160, 120 175, 120 175 C 120 175, 90 175, 70 175 Z" 
        fill={bellyColor} 
        stroke={strokeColor} 
        strokeWidth={strokeWidth} 
        strokeLinejoin="round" 
      />

      {/* Snout/Nose part */}
      <path 
        d="M100 65 C 140 55, 180 65, 175 95 C 170 125, 130 125, 115 110 Z" 
        fill={mainColor} 
        stroke={strokeColor} 
        strokeWidth={strokeWidth} 
        strokeLinejoin="round" 
      />

      {/* Horns */}
      <path d="M75 42 Q 65 20 80 15 Q 90 25 90 40" fill="#FFCA28" stroke={strokeColor} strokeWidth="4" strokeLinejoin="round" />
      <path d="M105 40 Q 115 20 100 15 Q 90 25 95 38" fill="#FFCA28" stroke={strokeColor} strokeWidth="4" strokeLinejoin="round" />

      {/* Eyes */}
      <circle cx="95" cy="55" r="9" fill={strokeColor} />
      <circle cx="125" cy="55" r="9" fill={strokeColor} />
      
      {/* Eye highlights */}
      <circle cx="92" cy="52" r="3.5" fill="white" />
      <circle cx="122" cy="52" r="3.5" fill="white" />

      {/* Nose holes */}
      <circle cx="145" cy="75" r="2.5" fill={strokeColor} />
      <circle cx="160" cy="78" r="2.5" fill={strokeColor} />

      {/* Mouth */}
      {isSad ? (
        <path d="M135 105 Q 150 95 160 105" stroke={strokeColor} strokeWidth="5" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M135 95 Q 150 115 165 95" stroke={strokeColor} strokeWidth="5" strokeLinecap="round" fill="none" />
      )}

      {/* Cheeks */}
      {isSad ? (
        <ellipse cx="140" cy="85" rx="8" ry="4" fill="#F48FB1" opacity="0.6" />
      ) : (
        <ellipse cx="150" cy="85" rx="8" ry="4" fill="#F48FB1" opacity="0.6" />
      )}

      {/* Arm */}
      <path d="M90 120 C 110 130, 115 110, 115 110" stroke={strokeColor} strokeWidth="6" strokeLinecap="round" fill="none" />

      <defs>
        <filter id="dragon-shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
    </svg>
  );
}
