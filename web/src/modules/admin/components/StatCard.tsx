import { ReactNode } from 'react';
import { IoCaretUp, IoCaretDown } from 'react-icons/io5';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  variant?: 'hero' | 'default';
  trend?: {
    value: number;
    isUp: boolean;
    label: string;
  };
}

export default function StatCard({ label, value, icon, variant = 'default', trend }: StatCardProps) {
  const isHero = variant === 'hero';

  return (
    <div className={`admin-card ${isHero ? 'admin-card-hero' : 'admin-card-default'}`}>
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        {icon && <span style={{ color: 'var(--admin-muted)', fontSize: 20 }}>{icon}</span>}
      </div>
      
      <div className={`stat-value ${isHero ? 'hero-value' : ''}`} style={isHero ? { fontSize: 42, color: 'var(--admin-primary)' } : {}}>
        {value}
      </div>

      {trend && (
        <div className={`stat-trend ${trend.isUp ? 'trend-up' : 'trend-down'}`} style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 15, fontWeight: 700 }}>
          {trend.isUp ? <IoCaretUp /> : <IoCaretDown />}
          <span>{trend.value}%</span>
          <span style={{ color: 'var(--admin-muted)', fontWeight: 600, marginLeft: 4 }}>
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}
