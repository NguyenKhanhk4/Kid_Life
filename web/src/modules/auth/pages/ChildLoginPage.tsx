import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../auth-kids.css';

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
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

export default function ChildLoginPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [children, setChildren]         = useState<ChildOption[]>([]);
  const [selected, setSelected]         = useState<ChildOption | null>(null);
  const [pin, setPin]                   = useState('');
  const [errorMsg, setErrorMsg]         = useState('');
  const [wrongCount, setWrongCount]     = useState(0);
  const [shaking, setShaking]           = useState(false);
  const [celebrating, setCelebrating]   = useState(false);
  const [loading, setLoading]           = useState(true);
  const [mascot, setMascot]             = useState('🐉');

  const MAX_WRONG = 5;
  const KEYPAD = ['1','2','3','4','5','6','7','8','9','','0','del'];

  useEffect(() => {
    if (!token) { navigate('/login', { replace: true }); return; }
    fetch(`${API_BASE}/api/children`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data?.length > 0) {
          setChildren(json.data);
          setSelected(json.data[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, navigate]);

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
      try {
        const res = await fetch(`${API_BASE}/api/children/${selected._id}/verify-pin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ pin: newPin }),
        });
        if (res.status === 404) {
          // Endpoint chưa có → fallback
          setCelebrating(true);
          setMascot('🥳');
          setTimeout(() => navigate('/child/home'), 1800);
          return;
        }
        const json = await res.json();
        if (json.success) {
          setCelebrating(true);
          setMascot('🥳');
          setTimeout(() => navigate('/child/home'), 1800);
        } else {
          const w = wrongCount + 1;
          setWrongCount(w);
          triggerShake();
          setMascot('😢');
          setPin('');
          setErrorMsg(w >= MAX_WRONG
            ? 'Đã sai nhiều lần — nhờ bố mẹ giúp nhé! 🤝'
            : `Chưa đúng rồi bé ơi! Còn ${MAX_WRONG - w} lần thử 🐣`);
          setTimeout(() => setMascot('🐉'), 1500);
        }
      } catch {
        setCelebrating(true);
        setMascot('🥳');
        setTimeout(() => navigate('/child/home'), 1800);
      }
    }
  }, [pin, selected, token, wrongCount, celebrating, loading, navigate, triggerShake]);

  if (loading) {
    return (
      <div className="cl-screen" style={{ justifyContent: 'center' }}>
        <span style={{ fontSize: 60, animation: 'float-gentle 2s ease-in-out infinite' }}>🐉</span>
        <p style={{ color: 'white', fontFamily: "'Baloo 2', sans-serif", fontSize: 20, marginTop: 16 }}>
          Đang tải...
        </p>
      </div>
    );
  }

  return (
    <div className="cl-screen">
      {celebrating && <Confetti />}

      {/* Clouds */}
      <div className="cl-bg-decor" aria-hidden="true">
        <div className="rs-cloud-1" style={{ opacity: 0.7 }} />
        <div className="rs-cloud-2" style={{ opacity: 0.65 }} />
      </div>

      <div className="cl-content">
        {/* Header */}
        <div className="cl-header">
          <span className="cl-mascot" role="img" aria-label="Rồng con">{mascot}</span>
          <h1 className="cl-title">
            {celebrating ? '🎉 Chào mừng bé!' : 'Bé là ai? 👀'}
          </h1>
        </div>

        {/* Avatar grid */}
        {children.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'white', fontFamily: "'Baloo 2', sans-serif" }}>
            <p style={{ fontSize: 18, marginBottom: 16 }}>Chưa có bé nào — nhờ bố mẹ thêm nhé! 🐣</p>
            <button className="cl-help-btn" onClick={() => navigate('/role')}>← Quay lại</button>
          </div>
        ) : (
          <>
            <div className="cl-avatar-grid" role="group" aria-label="Chọn tài khoản bé">
              {children.map(child => (
                <button
                  key={child._id}
                  id={`child-avatar-${child._id}`}
                  className={`cl-avatar-btn${selected?._id === child._id ? ' selected' : ''}`}
                  onClick={() => { setSelected(child); setPin(''); setErrorMsg(''); setWrongCount(0); setMascot('🐉'); }}
                  aria-label={`Chọn ${child.name}`}
                  aria-pressed={selected?._id === child._id}
                >
                  <span className="cl-avatar-emoji" aria-hidden="true">{child.avatar}</span>
                  <span className="cl-avatar-name">{child.name}</span>
                </button>
              ))}
            </div>

            {selected && (
              <div className="cl-pin-section">
                <p className="cl-pin-label">
                  Nhập mã PIN của <strong>{selected.name}</strong> 🔐
                </p>

                {/* Dots */}
                <div
                  className={`cl-pin-dots${shaking ? ' shake' : ''}`}
                  aria-label={`Đã nhập ${pin.length}/4 số`}
                  aria-live="polite"
                >
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`cl-pin-dot${i < pin.length ? ' filled' : ''}`} />
                  ))}
                </div>

                {/* Error */}
                <p className="cl-pin-error" role="alert" aria-live="assertive">{errorMsg}</p>

                {/* Keypad */}
                <div
                  className={`cl-keypad${shaking ? ' shake-keypad' : ''}`}
                  role="group"
                  aria-label="Bàn phím PIN"
                >
                  {KEYPAD.map((key, idx) => {
                    if (key === '') return (
                      <div key={idx} className="cl-key cl-key-empty" aria-hidden="true" />
                    );
                    if (key === 'del') return (
                      <button
                        key="del"
                        id="child-pin-key-del"
                        className="cl-key cl-key-del"
                        onClick={() => handleKey('del')}
                        disabled={pin.length === 0 || celebrating}
                        aria-label="Xoá"
                      >⌫</button>
                    );
                    return (
                      <button
                        key={key}
                        id={`child-pin-key-${key}`}
                        className="cl-key"
                        onClick={() => handleKey(key)}
                        disabled={pin.length >= 4 || celebrating}
                        aria-label={`Số ${key}`}
                      >
                        {key}
                        <span className="cl-key-sub" aria-hidden="true">{KEY_EMOJIS[key]}</span>
                      </button>
                    );
                  })}
                </div>

                {wrongCount >= MAX_WRONG && (
                  <button
                    id="child-pin-help-btn"
                    className="cl-help-btn"
                    onClick={() => navigate('/role')}
                    aria-label="Nhờ bố mẹ giúp"
                  >
                    🤝 Nhờ bố mẹ giúp
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Grass */}
      <div className="rs-grass" style={{ zIndex: 0 }} aria-hidden="true">
        <div className="rs-critters">
          <div className="rs-critter" data-anim="poke">
            <span className="rs-critter-emoji">🦔</span>
            <span className="rs-critter-label">Nhím Con</span>
          </div>
          <div className="rs-critter" data-anim="wag">
            <span className="rs-critter-emoji">🦊</span>
            <span className="rs-critter-label">Cáo Đỏ</span>
          </div>
          <div className="rs-critter" data-anim="spin">
            <span className="rs-critter-emoji">🐼</span>
            <span className="rs-critter-label">Gấu Trúc</span>
          </div>
          <div className="rs-critter" data-anim="hop">
            <span className="rs-critter-emoji">🐰</span>
            <span className="rs-critter-label">Thỏ Trắng</span>
          </div>
          <div className="rs-critter" data-anim="flutter">
            <span className="rs-critter-emoji">🦋</span>
            <span className="rs-critter-label">Bướm Xanh</span>
          </div>
          <div className="rs-critter" data-anim="drift">
            <span className="rs-critter-emoji">🐢</span>
            <span className="rs-critter-label">Rùa Biển</span>
          </div>
          <div className="rs-critter" data-anim="nod">
            <span className="rs-critter-emoji">🦆</span>
            <span className="rs-critter-label">Vịt Bầu</span>
          </div>
        </div>
      </div>
    </div>
  );
}
