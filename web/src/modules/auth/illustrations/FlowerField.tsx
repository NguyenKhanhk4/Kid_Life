/**
 * FlowerField — Dải đồi cỏ xanh + hoa nhiều màu, trang trí footer.
 *
 * Đổi màu qua CSS variables:
 *   --grass-fill:  màu cỏ chính (mặc định var(--kid-grass) #7ED957)
 *   --grass-dark:  màu cỏ tối (bóng đồi — mặc định var(--kid-grass-dark) #52B830)
 *
 * Props:
 *   className — thêm class cho animation từ CSS bên ngoài
 *   height    — chiều cao SVG (mặc định 140)
 */

interface FlowerFieldProps {
  className?: string;
  height?: number;
}

// Component hoa con tái sử dụng
function Flower({ x, y, color, petalColor, size = 1 }: {
  x: number; y: number; color: string; petalColor: string; size?: number;
}) {
  const r = 7 * size;
  const pr = 5 * size;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Cành */}
      <line x1="0" y1="0" x2="0" y2={12 * size} stroke="#52B830" strokeWidth={2 * size} strokeLinecap="round" />
      {/* Cánh hoa (4 hướng) */}
      {[0, 90, 180, 270].map((deg) => (
        <ellipse
          key={deg}
          cx={Math.cos((deg * Math.PI) / 180) * r}
          cy={Math.sin((deg * Math.PI) / 180) * r}
          rx={pr}
          ry={pr * 0.6}
          transform={`rotate(${deg}, ${Math.cos((deg * Math.PI) / 180) * r}, ${Math.sin((deg * Math.PI) / 180) * r})`}
          fill={petalColor}
          opacity={0.9}
        />
      ))}
      {/* Nhụy giữa */}
      <circle cx="0" cy="0" r={4 * size} fill={color} />
    </g>
  );
}

// Cây cỏ nhỏ trang trí
function GrassBlade({ x, y, height = 20, lean = 0 }: { x: number; y: number; height?: number; lean?: number }) {
  return (
    <path
      d={`M ${x} ${y} Q ${x + lean} ${y - height / 2} ${x + lean * 1.5} ${y - height}`}
      stroke="#52B830"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
  );
}

export default function FlowerField({ className = '', height = 140 }: FlowerFieldProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 800 ${height}`}
      preserveAspectRatio="xMidYMax slice"
      className={`flower-field-svg ${className}`}
      aria-hidden="true"
      style={{ width: '100%', height: `${height}px`, display: 'block' }}
    >
      {/* ── Đồi cỏ sau (tông sáng hơn) ──────────────────────────── */}
      <path
        d="M 0 90 Q 100 60 200 80 Q 300 100 400 70 Q 500 40 600 65 Q 700 88 800 72 L 800 140 L 0 140 Z"
        fill="var(--grass-dark, #52B830)"
        opacity="0.55"
      />

      {/* ── Đồi cỏ chính ─────────────────────────────────────────── */}
      <path
        d="M 0 105 Q 80 78 160 96 Q 250 116 340 88 Q 430 62 520 82 Q 610 102 700 85 Q 750 76 800 92 L 800 140 L 0 140 Z"
        fill="var(--grass-fill, #7ED957)"
      />

      {/* ── Cỏ nhỏ trang trí ──────────────────────────────────────── */}
      <GrassBlade x={30} y={105} height={22} lean={4} />
      <GrassBlade x={40} y={108} height={16} lean={-3} />
      <GrassBlade x={120} y={95} height={20} lean={5} />
      <GrassBlade x={240} y={100} height={18} lean={-4} />
      <GrassBlade x={350} y={92} height={24} lean={3} />
      <GrassBlade x={480} y={85} height={20} lean={-5} />
      <GrassBlade x={580} y={88} height={22} lean={4} />
      <GrassBlade x={680} y={90} height={18} lean={-3} />
      <GrassBlade x={760} y={95} height={20} lean={4} />

      {/* ── Hoa trang trí ─────────────────────────────────────────── */}
      {/* Hoa vàng */}
      <Flower x={60} y={100} color="#FFD93D" petalColor="#FFE97A" size={0.9} />
      {/* Hoa đỏ san hô */}
      <Flower x={155} y={92} color="#FF6B6B" petalColor="#FFA5A5" size={0.8} />
      {/* Hoa tím */}
      <Flower x={260} y={95} color="#A78BFA" petalColor="#C4B0FF" size={1.0} />
      {/* Hoa cam */}
      <Flower x={380} y={86} color="#FFA900" petalColor="#FFCC5C" size={0.85} />
      {/* Hoa hồng */}
      <Flower x={490} y={80} color="#FF79B0" petalColor="#FFB3D0" size={0.95} />
      {/* Hoa xanh mint */}
      <Flower x={600} y={83} color="#28B978" petalColor="#6EDCAA" size={0.8} />
      {/* Hoa vàng nhỏ */}
      <Flower x={710} y={88} color="#FFD93D" petalColor="#FFE97A" size={0.75} />
      {/* Hoa đỏ nhỏ ở cạnh */}
      <Flower x={770} y={93} color="#FF6B6B" petalColor="#FFA5A5" size={0.7} />

      {/* ── Bướm nhỏ trang trí ─────────────────────────────────────── */}
      <g transform="translate(320, 72)" opacity="0.85" className="butterfly">
        <ellipse cx="-8" cy="-4" rx="9" ry="6" fill="#A78BFA" opacity="0.8" />
        <ellipse cx="8" cy="-4" rx="9" ry="6" fill="#A78BFA" opacity="0.8" />
        <ellipse cx="-6" cy="3" rx="6" ry="4" fill="#C4B0FF" opacity="0.7" />
        <ellipse cx="6" cy="3" rx="6" ry="4" fill="#C4B0FF" opacity="0.7" />
        <line x1="0" y1="-8" x2="-5" y2="-14" stroke="#3A3355" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="0" y1="-8" x2="5" y2="-14" stroke="#3A3355" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="0" cy="0" rx="2.5" ry="6" fill="#3A3355" />
      </g>

      {/* Bướm thứ 2 */}
      <g transform="translate(530, 65)" opacity="0.75" className="butterfly" style={{ animationDelay: '-1.5s' }}>
        <ellipse cx="-7" cy="-3" rx="8" ry="5.5" fill="#FFD93D" opacity="0.8" />
        <ellipse cx="7" cy="-3" rx="8" ry="5.5" fill="#FFD93D" opacity="0.8" />
        <ellipse cx="-5" cy="3" rx="5" ry="3.5" fill="#FFE97A" opacity="0.7" />
        <ellipse cx="5" cy="3" rx="5" ry="3.5" fill="#FFE97A" opacity="0.7" />
        <ellipse cx="0" cy="0" rx="2" ry="5" fill="#3A3355" />
      </g>
    </svg>
  );
}
