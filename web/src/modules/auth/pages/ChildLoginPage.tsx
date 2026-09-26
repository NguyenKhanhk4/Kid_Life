import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { setActiveChildId } from '@/shared/utils/activeChild';
import { IoArrowBackOutline } from 'react-icons/io5';
import '../auth-premium.css';
import '../auth-kids.css'; // Keep this for keypad dots/animations

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const KEY_EMOJIS: Record<string, string> = {
  '1':'⭐','2':'🌙','3':'🌈','4':'🦋','5':'🌸',
  '6':'🐝','7':'🌻','8':'🍀','9':'🐾','0':'🎈',
};

interface ChildOption {
  _id: string; name: string; avatar: string; level: number; xp: number;
}

function Confetti() {
  const colors = ['#FFD700','#FF6B6B','#A78BFA','#7ED957','#54C5F8','#FF79B0'];
  return (
    <>
      {Array.from({ length: 35 }, (_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${-10 - Math.random() * 20}%`,
            background: colors[i % colors.length],
            width: `${8 + Math.random() * 10}px`,
            height: `${8 + Math.random() * 10}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '3px',
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${1.2 + Math.random() * 0.8}s`,
            position: 'absolute',
            zIndex: 9999
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

const DEFAULT_CHILDREN: ChildOption[] = [
  { _id: 'child_bo', name: 'Bé Bo', avatar: '🦁', level: 2, xp: 120 },
  { _id: 'child_bong', name: 'Bé Bông', avatar: '🐰', level: 1, xp: 45 },
];

export default function ChildLoginPage() {
  const navigate = useNavigate();
  const { token, isLoading: authLoading } = useAuth();

  const [children, setChildren]         = useState<ChildOption[]>([]);
  const [selected, setSelected]         = useState<ChildOption | null>(null);
  const [pin, setPin]                   = useState('');
  const [errorMsg, setErrorMsg]         = useState('');
  const [wrongCount, setWrongCount]     = useState(0);
  const [shaking, setShaking]           = useState(false);
  const [celebrating, setCelebrating]   = useState(false);
  const [loading, setLoading]           = useState(true);

  const MAX_WRONG = 5;
  const KEYPAD = ['1','2','3','4','5','6','7','8','9','','0','del'];

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      setChildren(DEFAULT_CHILDREN);
      setSelected(DEFAULT_CHILDREN[0]);
      setLoading(false);
      return;
    }

    const saved = localStorage.getItem('kl_device_children');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setChildren(parsed);
        if (parsed.length > 0) setSelected(parsed[0]);
      } catch (e) { console.error(e); }
    }

    fetch(`${API_BASE}/api/children`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data?.length > 0) {
          setChildren(json.data);
          if (!selected) setSelected(json.data[0]);
          localStorage.setItem('kl_device_children', JSON.stringify(json.data));
        } else if (!saved) {
          setChildren(DEFAULT_CHILDREN);
          setSelected(DEFAULT_CHILDREN[0]);
        }
      })
      .catch(() => {
        if (!saved) {
          setChildren(DEFAULT_CHILDREN);
          setSelected(DEFAULT_CHILDREN[0]);
        }
      })
      .finally(() => setLoading(false));
  }, [token, authLoading]);

  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 450);
  }, []);

  const handleKey = useCallback(async (key: string) => {
    if (celebrating || loading) return;
    if (key === 'del') { setPin(p => p.slice(0, -1)); setErrorMsg(''); return; }

    const newPin = pin + key;
    setPin(newPin);
    setErrorMsg('');

    if (newPin.length === 4) {
      if (!selected) return;

      if (!token || selected._id.startsWith('child_')) {
        setCelebrating(true);
        setTimeout(() => navigate('/child/home'), 1500);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/children/${selected._id}/verify-pin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ pin: newPin }),
        });
        if (res.status === 404) {
          setCelebrating(true);
          setTimeout(() => navigate('/child/home'), 1800);
          return;
        }
        const json = await res.json();
        if (json.success) {
          setActiveChildId(selected._id);
          setCelebrating(true);
          setTimeout(() => navigate('/child/home'), 1800);
        } else {
          const w = wrongCount + 1;
          setWrongCount(w);
          triggerShake();
          setPin('');
          setErrorMsg(w >= MAX_WRONG
            ? 'Đã sai nhiều lần — nhờ bố mẹ giúp nhé! 🤝'
            : `Chưa đúng rồi bé ơi! Còn ${MAX_WRONG - w} lần thử 🐣`);
        }
      } catch {
        setCelebrating(true);
        setTimeout(() => navigate('/child/home'), 1800);
      }
    }
  }, [pin, selected, token, wrongCount, celebrating, loading, navigate, triggerShake]);

  if (loading) {
    return (
      <div className="premium-screen" style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div className="premium-bg-child"></div>
        <span style={{ fontSize: 60, animation: 'float 2s ease-in-out infinite', zIndex: 1 }}>🐉</span>
        <p style={{ color: 'white', fontFamily: "'Baloo 2', sans-serif", fontSize: 24, marginTop: 16, zIndex: 1 }}>
          Đang tải...
        </p>
      </div>
    );
  }

  return (
    <div className="premium-screen">
      {celebrating && <Confetti />}
      <div className="premium-bg-child"></div>

      {/* Floating Animations */}
      <div className="cl-bg-decor" aria-hidden="true" style={{ zIndex: 1 }}>
        <div className="rs-cloud-1" style={{ opacity: 0.5 }} />
        <div className="rs-cloud-2" style={{ opacity: 0.4 }} />
      </div>

      {/* Cột Trái - Chào mừng & Chọn bé */}
      <div className="premium-left" style={{ justifyContent: 'center', zIndex: 2 }}>
        <button 
          onClick={() => navigate('/role')}
          style={{ position: 'absolute', top: 40, left: 60, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 20, padding: '10px 20px', color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', backdropFilter: 'blur(10px)', fontWeight: 600 }}
        >
          <IoArrowBackOutline size={20} /> Quay lại
        </button>

        <div className="children-section" style={{ marginTop: 0 }}>
          <h2 className="children-title" style={{ fontSize: 36, marginBottom: 30 }}>Bé nào đang chơi hôm nay?</h2>
          {children.length === 0 ? (
            <div style={{ color: 'white', fontFamily: "'Baloo 2', sans-serif" }}>
              <p style={{ fontSize: 20, marginBottom: 16 }}>Chưa có bé nào — nhờ bố mẹ thêm nhé! 🐣</p>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {children.map((child, index) => {
                const isActive = selected?._id === child._id;
                return (
                  <div 
                    key={child._id} 
                    className={`glass-card child-card ${isActive ? 'active' : ''}`}
                    onClick={() => { setSelected(child); setPin(''); setErrorMsg(''); setWrongCount(0); }}
                    style={{ animationDelay: `${index * 0.1}s`, width: 150, padding: '24px 12px' }}
                  >
                    <div className="child-emoji" style={{ width: 84, height: 84, borderRadius: 28, overflow: 'hidden', display: 'grid', placeItems: 'center', background: '#fff', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.05)' }}>
                      {child.avatar?.startsWith('/') ? (
                        <img src={child.avatar} alt="avatar" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                      ) : (
                        child.avatar || '🧒'
                      )}
                    </div>
                    <div className="child-name" style={{ fontSize: 22, marginTop: 4 }}>{child.name}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cột Phải - Form Nhập mã PIN */}
      <div className="premium-right" style={{ zIndex: 2 }}>
        <div className="glass-panel" style={{ maxWidth: 460, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 40px', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
          
          {selected && (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <h2 className="form-title" style={{ fontSize: 32, marginBottom: 12, whiteSpace: 'normal', lineHeight: 1.3 }}>
                Mã bí mật của <br/><span style={{ color: '#FFD700', fontSize: 36, display: 'inline-block', marginTop: 8 }}>{selected.name}</span>
              </h2>
              <p className="form-subtitle" style={{ fontSize: 16, marginBottom: 40, color: 'rgba(255,255,255,0.9)' }}>
                Nhập 4 số mã PIN để vào chơi nhé! 🔐
              </p>

              {/* Dots */}
              <div
                className={`cl-pin-dots${shaking ? ' shake' : ''}`}
                style={{ justifyContent: 'center', gap: 24, marginBottom: 40 }}
              >
                {[0,1,2,3].map(i => (
                  <div key={i} className={`cl-pin-dot${i < pin.length ? ' filled' : ''}`} style={{ width: 24, height: 24, borderWidth: 3 }} />
                ))}
              </div>

              {/* Error */}
              <div style={{ minHeight: 30, marginBottom: 30 }}>
                {errorMsg && <p style={{ color: '#FEE2E2', background: 'rgba(220,38,38,0.8)', padding: '10px 20px', borderRadius: 16, display: 'inline-block', fontWeight: 600, fontSize: 15 }}>⚠️ {errorMsg}</p>}
              </div>

              {/* Keypad */}
              <div
                className={`cl-keypad${shaking ? ' shake-keypad' : ''}`}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gridTemplateRows: 'repeat(4, 80px)', gap: 24, justifyContent: 'center', margin: '0 auto' }}
              >
                {KEYPAD.map((key, idx) => {
                  if (key === '') return <div key={idx} />;
                  if (key === 'del') return (
                    <button
                      key="del"
                      onClick={() => handleKey('del')}
                      disabled={pin.length === 0 || celebrating}
                      style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 24, fontSize: 28, color: '#fff', cursor: 'pointer', transition: '0.2s', width: '100%', height: '100%' }}
                    >⌫</button>
                  );
                  return (
                    <button
                      key={key}
                      onClick={() => handleKey(key)}
                      disabled={pin.length >= 4 || celebrating}
                      style={{ 
                        background: 'rgba(255,255,255,0.95)', 
                        border: 'none', 
                        borderRadius: 24, 
                        width: '100%',
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                        transform: 'translateY(0)',
                        transition: 'transform 0.1s, box-shadow 0.1s',
                        padding: 0
                      }}
                      onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
                      onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                    >
                      <span style={{ fontSize: 36, fontWeight: 800, color: '#6D28D9', lineHeight: 1 }}>{key}</span>
                      <span style={{ fontSize: 18, marginTop: 4 }}>{KEY_EMOJIS[key]}</span>
                    </button>
                  );
                })}
              </div>

              {wrongCount >= MAX_WRONG && (
                <button
                  onClick={() => navigate('/role')}
                  style={{ marginTop: 32, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 24, padding: '14px 28px', color: '#fff', fontSize: 18, fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(10px)' }}
                >
                  🤝 Nhờ bố mẹ giúp
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
