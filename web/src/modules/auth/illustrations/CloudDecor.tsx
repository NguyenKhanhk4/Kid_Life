/**
 * CloudDecor — Ba đám mây bồng bềnh trang trí nền trời.
 *
 * Đổi màu qua CSS variables:
 *   --cloud-fill:    màu mây (mặc định #FFFFFF)
 *   --cloud-opacity: độ trong suốt (mặc định 0.9)
 *
 * Props:
 *   className — thêm class cho animation từ CSS bên ngoài
 *   variant   — 'header' (mây ngang đầu trang) | 'full' (3 mây to nhỏ)
 */

interface CloudDecorProps {
  className?: string;
  variant?: 'header' | 'full';
}

function Cloud({ x, y, scale = 1, opacity = 1, animDelay = '0s' }: {
  x: number; y: number; scale?: number; opacity?: number; animDelay?: string;
}) {
  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      opacity={opacity}
      style={{ animationDelay: animDelay }}
      className="cloud-group"
    >
      {/* Thân mây chính */}
      <ellipse cx="60" cy="30" rx="50" ry="22" fill="var(--cloud-fill, #FFFFFF)" />
      {/* Vòm mây trái */}
      <ellipse cx="30" cy="20" rx="28" ry="20" fill="var(--cloud-fill, #FFFFFF)" />
      {/* Vòm mây giữa (cao nhất) */}
      <ellipse cx="60" cy="12" rx="32" ry="24" fill="var(--cloud-fill, #FFFFFF)" />
      {/* Vòm mây phải */}
      <ellipse cx="88" cy="20" rx="26" ry="19" fill="var(--cloud-fill, #FFFFFF)" />
      {/* Đáy phẳng */}
      <rect x="12" y="30" width="96" height="16" rx="8" fill="var(--cloud-fill, #FFFFFF)" />
    </g>
  );
}

export default function CloudDecor({ className = '', variant = 'header' }: CloudDecorProps) {
  if (variant === 'header') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 120"
        preserveAspectRatio="xMidYMid slice"
        className={`cloud-decor-svg ${className}`}
        aria-hidden="true"
        style={{ width: '100%', height: '120px', display: 'block' }}
      >
        {/* Mây lớn bên trái — trôi nhẹ */}
        <g className="cloud-drift-1">
          <Cloud x={-10} y={10} scale={1.1} opacity={0.95} />
        </g>
        {/* Mây nhỏ giữa — trôi chậm hơn */}
        <g className="cloud-drift-2">
          <Cloud x={280} y={5} scale={0.75} opacity={0.8} />
        </g>
        {/* Mây vừa bên phải — trôi ngược */}
        <g className="cloud-drift-3">
          <Cloud x={560} y={15} scale={0.9} opacity={0.9} />
        </g>
      </svg>
    );
  }

  // variant === 'full' — mây rải rác toàn nền
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMid slice"
      className={`cloud-decor-svg cloud-decor-full ${className}`}
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', inset: 0 }}
    >
      <g className="cloud-drift-1"><Cloud x={-20} y={20} scale={1.2} opacity={0.9} /></g>
      <g className="cloud-drift-2"><Cloud x={300} y={10} scale={0.7} opacity={0.75} /></g>
      <g className="cloud-drift-3"><Cloud x={580} y={30} scale={1.0} opacity={0.85} /></g>
      <g className="cloud-drift-1" style={{ animationDelay: '-3s' }}>
        <Cloud x={100} y={200} scale={0.6} opacity={0.6} />
      </g>
      <g className="cloud-drift-2" style={{ animationDelay: '-5s' }}>
        <Cloud x={450} y={220} scale={0.8} opacity={0.7} />
      </g>
    </svg>
  );
}
