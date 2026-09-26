import { ReactNode } from 'react';

interface SettingCardProps {
  title: string;
  children: ReactNode;
}

export default function SettingCard({ title, children }: SettingCardProps) {
  return (
    <div className="admin-card" style={{ marginBottom: 24, padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-bg)' }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{title}</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
