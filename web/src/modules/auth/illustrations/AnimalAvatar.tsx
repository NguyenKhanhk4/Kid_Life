export type AnimalSpecies = 'cat' | 'bunny' | 'bear' | 'hedgehog' | 'owl' | 'panda' | 'butterfly' | 'frog' | 'duck';

export default function AnimalAvatar({ species, className, width = 64, height = 64 }: { species: AnimalSpecies, className?: string, width?: number | string, height?: number | string }) {
  const strokeColor = "#2D2545";
  const strokeWidth = 3;

  const renderFace = (eyeColor = strokeColor, mouthOffset = 0) => (
    <>
      <circle cx="35" cy={45 + mouthOffset} r="4" fill={eyeColor} />
      <circle cx="65" cy={45 + mouthOffset} r="4" fill={eyeColor} />
      <circle cx="34" cy={44 + mouthOffset} r="1.5" fill="white" />
      <circle cx="64" cy={44 + mouthOffset} r="1.5" fill="white" />
      <path d={`M45 ${55 + mouthOffset} Q 50 ${60 + mouthOffset} 55 ${55 + mouthOffset}`} stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  );

  const renderSpecies = () => {
    switch (species) {
      case 'cat':
        return (
          <>
            <path d="M20 20 L 30 40 L 70 40 L 80 20 Z" fill="#F4B41A" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
            <circle cx="50" cy="50" r="30" fill="#F4B41A" stroke={strokeColor} strokeWidth={strokeWidth} />
            <path d="M50 50 L 45 55 L 55 55 Z" fill="#F48FB1" stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
            {renderFace()}
          </>
        );
      case 'bunny':
        return (
          <>
            <path d="M35 15 C35 5, 45 5, 45 15 L 45 40 Z" fill="#FFFFFF" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
            <path d="M65 15 C65 5, 55 5, 55 15 L 55 40 Z" fill="#FFFFFF" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
            <circle cx="50" cy="50" r="28" fill="#FFFFFF" stroke={strokeColor} strokeWidth={strokeWidth} />
            <path d="M50 52 L 48 55 L 52 55 Z" fill="#F48FB1" stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
            {renderFace()}
          </>
        );
      case 'bear':
        return (
          <>
            <circle cx="25" cy="25" r="12" fill="#8D6E63" stroke={strokeColor} strokeWidth={strokeWidth} />
            <circle cx="75" cy="25" r="12" fill="#8D6E63" stroke={strokeColor} strokeWidth={strokeWidth} />
            <circle cx="50" cy="50" r="32" fill="#8D6E63" stroke={strokeColor} strokeWidth={strokeWidth} />
            <ellipse cx="50" cy="55" rx="15" ry="10" fill="#D7CCC8" stroke={strokeColor} strokeWidth={strokeWidth} />
            <path d="M50 50 L 47 53 L 53 53 Z" fill={strokeColor} strokeLinejoin="round" />
            {renderFace()}
          </>
        );
      case 'frog':
        return (
          <>
            <circle cx="30" cy="30" r="12" fill="#81C784" stroke={strokeColor} strokeWidth={strokeWidth} />
            <circle cx="70" cy="30" r="12" fill="#81C784" stroke={strokeColor} strokeWidth={strokeWidth} />
            <circle cx="50" cy="50" r="30" fill="#81C784" stroke={strokeColor} strokeWidth={strokeWidth} />
            <circle cx="30" cy="30" r="6" fill="#FFF" stroke={strokeColor} strokeWidth="2" />
            <circle cx="70" cy="30" r="6" fill="#FFF" stroke={strokeColor} strokeWidth="2" />
            <circle cx="30" cy="30" r="2.5" fill={strokeColor} />
            <circle cx="70" cy="30" r="2.5" fill={strokeColor} />
            <path d="M35 55 Q 50 65 65 55" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        );
      case 'panda':
        return (
          <>
            <circle cx="25" cy="30" r="12" fill="#2D2545" stroke={strokeColor} strokeWidth={strokeWidth} />
            <circle cx="75" cy="30" r="12" fill="#2D2545" stroke={strokeColor} strokeWidth={strokeWidth} />
            <circle cx="50" cy="50" r="30" fill="#FFFFFF" stroke={strokeColor} strokeWidth={strokeWidth} />
            <ellipse cx="35" cy="45" rx="10" ry="12" fill="#2D2545" transform="rotate(-30 35 45)" />
            <ellipse cx="65" cy="45" rx="10" ry="12" fill="#2D2545" transform="rotate(30 65 45)" />
            <path d="M50 54 L 47 57 L 53 57 Z" fill={strokeColor} strokeLinejoin="round" />
            {/* White highlights for eyes are drawn on top of black patches */}
            <circle cx="35" cy="45" r="3.5" fill="#FFF" />
            <circle cx="65" cy="45" r="3.5" fill="#FFF" />
            <circle cx="34" cy="44" r="1.5" fill="#2D2545" />
            <circle cx="64" cy="44" r="1.5" fill="#2D2545" />
            <path d="M45 60 Q 50 65 55 60" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        );
      case 'hedgehog':
        return (
          <>
            <path d="M15 65 C 10 30, 90 30, 85 65 Z" fill="#795548" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
            <path d="M30 65 C 30 45, 70 45, 70 65 Z" fill="#D7CCC8" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
            <circle cx="50" cy="52" r="3" fill={strokeColor} />
            <circle cx="40" cy="48" r="3" fill={strokeColor} />
            <circle cx="60" cy="48" r="3" fill={strokeColor} />
            <circle cx="39" cy="47" r="1" fill="white" />
            <circle cx="59" cy="47" r="1" fill="white" />
          </>
        );
      case 'duck':
        return (
          <>
            <circle cx="50" cy="45" r="28" fill="#FFF176" stroke={strokeColor} strokeWidth={strokeWidth} />
            <ellipse cx="50" cy="60" rx="18" ry="10" fill="#FF8A65" stroke={strokeColor} strokeWidth={strokeWidth} />
            <path d="M40 58 Q 50 62 60 58" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="40" cy="38" r="3.5" fill={strokeColor} />
            <circle cx="60" cy="38" r="3.5" fill={strokeColor} />
            <circle cx="39" cy="37" r="1" fill="white" />
            <circle cx="59" cy="37" r="1" fill="white" />
          </>
        );
      case 'owl':
        return (
          <>
            <path d="M25 25 L 35 35 L 65 35 L 75 25 L 80 70 L 20 70 Z" fill="#A1887F" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
            <circle cx="38" cy="45" r="14" fill="#FFFFFF" stroke={strokeColor} strokeWidth={strokeWidth} />
            <circle cx="62" cy="45" r="14" fill="#FFFFFF" stroke={strokeColor} strokeWidth={strokeWidth} />
            <circle cx="38" cy="45" r="4" fill={strokeColor} />
            <circle cx="62" cy="45" r="4" fill={strokeColor} />
            <circle cx="37" cy="44" r="1.5" fill="white" />
            <circle cx="61" cy="44" r="1.5" fill="white" />
            <path d="M48 55 L 52 55 L 50 60 Z" fill="#FFCA28" stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
          </>
        );
      case 'butterfly':
        return (
          <>
            <path d="M50 20 L 15 15 C 15 35, 30 45, 45 45 Z" fill="#29B6F6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
            <path d="M50 20 L 85 15 C 85 35, 70 45, 55 45 Z" fill="#29B6F6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
            <path d="M45 45 C 30 45, 20 60, 35 70 C 45 75, 45 60, 48 50 Z" fill="#4FC3F7" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
            <path d="M55 45 C 70 45, 80 60, 65 70 C 55 75, 55 60, 52 50 Z" fill="#4FC3F7" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
            <rect x="46" y="20" width="8" height="40" rx="4" fill="#2D2545" />
            <path d="M48 20 C 40 10, 35 15, 35 15" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M52 20 C 60 10, 65 15, 65 15" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        );
      default:
        return (
          <>
            <circle cx="50" cy="50" r="30" fill="#E0E0E0" stroke={strokeColor} strokeWidth={strokeWidth} />
            {renderFace()}
          </>
        );
    }
  };

  return (
    <svg 
      className={className} 
      width={width} 
      height={height} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderSpecies()}
    </svg>
  );
}
