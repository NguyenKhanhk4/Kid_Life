import { motion } from 'framer-motion';

export interface RadarAxis {
  label: string;
  /** 0..100 */
  value: number;
  color?: string;
}

interface RadarChartProps {
  axes: RadarAxis[];
  size?: number;
}

const GRID_LEVELS = [0.25, 0.5, 0.75, 1];

/**
 * Radar chart SVG thuần (không thư viện chart). Trục chia đều 360°/n, trục đầu tiên hướng lên trên.
 * Vùng dữ liệu animate từ tâm ra ngoài bằng Framer Motion (nội suy thuộc tính `d`).
 */
export function RadarChart({ axes, size = 340 }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.27;
  const n = axes.length;

  const point = (i: number, ratio: number) => {
    const angle = ((i * 360) / n - 90) * (Math.PI / 180);
    return { x: center + radius * ratio * Math.cos(angle), y: center + radius * ratio * Math.sin(angle) };
  };
  const pathOf = (ratios: number[]) =>
    ratios.map((r, i) => {
      const p = point(i, r);
      return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    }).join(' ') + ' Z';

  const ratios = axes.map((a) => Math.max(0, Math.min(100, a.value)) / 100);
  const collapsed = axes.map(() => 0);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Biểu đồ radar kỹ năng">
      {GRID_LEVELS.map((level) => (
        <path key={level} d={pathOf(axes.map(() => level))} fill="none" stroke="#E8EDFC" strokeWidth={1.5} />
      ))}
      {axes.map((_, i) => {
        const p = point(i, 1);
        return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#D5DEFA" strokeWidth={1.5} />;
      })}

      <motion.path
        initial={{ d: pathOf(collapsed) }}
        animate={{ d: pathOf(ratios) }}
        transition={{ duration: 0.9, ease: [0.34, 1.3, 0.64, 1] }}
        fill="rgba(43, 68, 232, 0.25)"
        stroke="var(--kl-primary)"
        strokeWidth={3}
        strokeLinejoin="round"
      />

      {axes.map((a, i) => {
        const p = point(i, ratios[i]);
        return (
          <motion.circle
            key={a.label}
            initial={{ cx: center, cy: center, opacity: 0 }}
            animate={{ cx: p.x, cy: p.y, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.34, 1.3, 0.64, 1] }}
            r={5}
            fill={a.color ?? 'var(--kl-primary)'}
            stroke="#fff"
            strokeWidth={2}
          />
        );
      })}

      {axes.map((a, i) => {
        // nhãn 2 dòng (tên + điểm), căn giữa ngoài đầu trục để không bị cắt mép
        const p = point(i, 1.4);
        return (
          <text key={a.label} x={p.x} y={p.y - 4} textAnchor="middle" fill={a.color ?? 'var(--kl-primary)'} fontWeight={800} fontSize={13}>
            <tspan x={p.x}>{a.label}</tspan>
            <tspan x={p.x} dy={16}>{a.value}%</tspan>
          </text>
        );
      })}
    </svg>
  );
}
