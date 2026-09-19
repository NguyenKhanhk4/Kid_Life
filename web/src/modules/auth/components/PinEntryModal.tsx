import React, { useState } from 'react';

interface PinEntryModalProps {
  childId: string;
  childName: string;
  avatarSpecies?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PinEntryModal({ childId, childName, avatarSpecies, onClose, onSuccess }: PinEntryModalProps) {
  const [pin, setPin] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [shake, setShake] = useState(false);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const verifyPin = (currentPin: string) => {
    // Mock verification
    if (currentPin === '1234') { 
      onSuccess();
    } else {
      setShake(true);
      setErrorCount(prev => prev + 1);
      setTimeout(() => {
        setShake(false);
        setPin('');
      }, 500);
    }
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', 
      backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', 
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div className={`${shake ? 'shake' : ''}`} style={{
        background: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        borderRadius: 32, padding: '40px 32px', 
        width: 380, maxWidth: '90%', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', position: 'relative', 
        boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 20, right: 20, background: 'none', 
          border: 'none', fontSize: 28, cursor: 'pointer', color: '#9CA3AF'
        }}>
          &times;
        </button>

        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: '#F3F4F6',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 48, boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.1)',
          marginBottom: 16
        }}>
          {avatarSpecies || '🧑'}
        </div>

        <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 28, color: '#1F2937', margin: 0 }}>
          {childName}
        </h2>

        {errorCount > 0 ? (
          <p style={{ color: '#EF4444', fontWeight: 600, marginTop: 8, fontSize: 15 }}>Chưa đúng rồi, bé thử lại nha! 🐣</p>
        ) : (
          <p style={{ color: '#6B7280', fontWeight: 500, marginTop: 8, fontSize: 15 }}>Nhập mã PIN của bé</p>
        )}

        <div style={{ display: 'flex', gap: 16, margin: '32px 0' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: 20, height: 20, borderRadius: '50%', 
              background: i < pin.length ? '#8B5CF6' : '#E5E7EB',
              transition: 'all 0.2s ease',
              transform: i < pin.length ? 'scale(1.1)' : 'scale(1)'
            }} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, width: '100%' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} onClick={() => handleKeyPress(num.toString())} style={{
              height: 64, fontSize: 28, fontWeight: '700', color: '#1F2937', 
              background: 'white', border: '1px solid #E5E7EB', borderRadius: 20,
              cursor: 'pointer', transition: 'all 0.1s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(2px)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {num}
            </button>
          ))}
          <div />
          <button onClick={() => handleKeyPress('0')} style={{
            height: 64, fontSize: 28, fontWeight: '700', color: '#1F2937', 
            background: 'white', border: '1px solid #E5E7EB', borderRadius: 20,
            cursor: 'pointer', transition: 'all 0.1s',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(2px)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            0
          </button>
          <button onClick={handleBackspace} style={{
            height: 64, fontSize: 24, fontWeight: 'bold', color: '#EF4444', 
            background: '#FEF2F2', border: 'none', borderRadius: 20,
            cursor: 'pointer', transition: 'all 0.1s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(2px)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            &#9003;
          </button>
        </div>

        {errorCount >= 5 && (
          <button onClick={onClose} style={{
            marginTop: 24, background: 'none', border: 'none', 
            color: '#8B5CF6', fontWeight: '600', fontSize: 15, cursor: 'pointer',
            textDecoration: 'underline'
          }}>
            Nhờ bố mẹ giúp
          </button>
        )}
      </div>
    </div>
  );
}
