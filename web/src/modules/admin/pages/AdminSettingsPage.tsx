import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import SettingCard from '../components/SettingCard';
import SettingInputRow from '../components/SettingInputRow';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminSettingsPage() {
  const { token, user } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/settings`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      } else {
        // Mock data if API not ready
        mockSettings();
      }
    } catch (err) {
      mockSettings();
    } finally {
      setLoading(false);
    }
  };

  const mockSettings = () => {
    setSettings({
      wallet: {
        interestRateWeekly: { value: 5, updatedBy: 'admin', updatedAt: new Date().toISOString() }
      },
      wishes: {
        starsPerWish: { value: 50, updatedBy: 'admin', updatedAt: new Date().toISOString() },
        streakDaysForEvolution: { value: 7, updatedBy: 'admin', updatedAt: new Date().toISOString() }
      }
    });
  };

  const handleSaveSetting = async (group: string, key: string, value: any) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/settings/${group}.${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ value })
      });
      const data = await res.json();
      if (data.success) {
        setSettings((prev: any) => ({
          ...prev,
          [group]: {
            ...prev[group],
            [key]: { value, updatedBy: user?.fullName || 'Admin', updatedAt: new Date().toISOString() }
          }
        }));
      } else {
        // Optimistic update for UI testing
        setSettings((prev: any) => ({
          ...prev,
          [group]: {
            ...prev[group],
            [key]: { value, updatedBy: user?.fullName || 'Admin', updatedAt: new Date().toISOString() }
          }
        }));
      }
    } catch (err) {
      // Optimistic update for UI testing
      setSettings((prev: any) => ({
        ...prev,
        [group]: {
          ...prev[group],
          [key]: { value, updatedBy: user?.fullName || 'Admin', updatedAt: new Date().toISOString() }
        }
      }));
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Đang tải cấu hình...</div>;
  if (!settings) return null;

  return (
    <div style={{ maxWidth: 800 }}>
      <SettingCard title="Ngân hàng ảo">
        <SettingInputRow 
          label="Lãi suất tiết kiệm (%/tuần)" 
          value={settings.wallet?.interestRateWeekly?.value || 0} 
          updatedBy={settings.wallet?.interestRateWeekly?.updatedBy}
          updatedAt={settings.wallet?.interestRateWeekly?.updatedAt}
          onSave={(val) => handleSaveSetting('wallet', 'interestRateWeekly', val)} 
        />
      </SettingCard>

      <SettingCard title="Điều ước & Thú cưng">
        <SettingInputRow 
          label="Số Sao cần cho 1 điều ước" 
          value={settings.wishes?.starsPerWish?.value || 0} 
          updatedBy={settings.wishes?.starsPerWish?.updatedBy}
          updatedAt={settings.wishes?.starsPerWish?.updatedAt}
          onSave={(val) => handleSaveSetting('wishes', 'starsPerWish', val)} 
        />
        <SettingInputRow 
          label="Số ngày streak để pet tiến hoá" 
          value={settings.wishes?.streakDaysForEvolution?.value || 0} 
          updatedBy={settings.wishes?.streakDaysForEvolution?.updatedBy}
          updatedAt={settings.wishes?.streakDaysForEvolution?.updatedAt}
          onSave={(val) => handleSaveSetting('wishes', 'streakDaysForEvolution', val)} 
        />
      </SettingCard>
    </div>
  );
}
