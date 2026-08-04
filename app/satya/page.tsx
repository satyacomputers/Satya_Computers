'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DEV_USER = 'admin';
const DEV_PASS = 'admin123';
const DEV_SESSION_KEY = 'satya_dev_session';

export default function SatyaDevLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(DEV_SESSION_KEY) === 'active') {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));

    if (username === DEV_USER && password === DEV_PASS) {
      localStorage.setItem(DEV_SESSION_KEY, 'active');
      localStorage.setItem('standalone_dashboard_auth', 'true');
      localStorage.setItem('standalone_dashboard_role', 'admin');
      router.replace('/dashboard');
    } else {
      setError('Invalid credentials.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #401F5E 0%, #2a1040 50%, #1a0a2e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, fontFamily: "'Raleway', system-ui, sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '28px 28px', pointerEvents: 'none',
      }}/>
      {/* hatch */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 4px,rgba(241,90,36,0.05) 4px,rgba(241,90,36,0.05) 8px)',
        pointerEvents: 'none',
      }}/>

      <form onSubmit={handleLogin} style={{
        background: 'rgba(255,255,255,0.97)',
        border: '2px solid #F15A24',
        borderRadius: 24,
        padding: '48px 44px',
        width: '100%', maxWidth: 400,
        boxShadow: '0 40px 100px rgba(0,0,0,0.5), 6px 6px 0 #F15A24',
        display: 'flex', flexDirection: 'column', gap: 16,
        position: 'relative',
      }}>
        {/* Logo + brand */}
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <img src="/satya_computers_logo.png" alt="Satya Computers"
            style={{ height: 56, width: 'auto', margin: '0 auto 10px', display: 'block' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: '0.12em', color: '#1A1A1A', lineHeight: 1 }}>
            SATYA<span style={{ color: '#F15A24' }}>COMPUTERS</span>
          </div>

          {/* developer badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            margin: '10px auto 0',
            background: 'linear-gradient(135deg,#401F5E,#6b3fa0)',
            color: '#fff', padding: '5px 16px', borderRadius: 20,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>🛠️ Developer Access</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input type="text" placeholder="Username" value={username}
            onChange={e => setUsername(e.target.value)} autoComplete="username" required
            style={{
              border: '1.5px solid #E8E0F0', borderRadius: 12, padding: '13px 16px',
              color: '#1A1A1A', fontSize: 14, outline: 'none',
              fontFamily: "'Raleway', sans-serif", background: '#faf9ff',
            }}
          />
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)} autoComplete="current-password" required
            style={{
              border: '1.5px solid #E8E0F0', borderRadius: 12, padding: '13px 16px',
              color: '#1A1A1A', fontSize: 14, outline: 'none',
              fontFamily: "'Raleway', sans-serif", background: '#faf9ff',
            }}
          />
        </div>

        {error && (
          <div style={{
            background: '#fff0ee', border: '1px solid #f8b8a8',
            borderRadius: 10, padding: '10px 14px', fontSize: 13,
            color: '#c0392b', textAlign: 'center',
          }}>{error}</div>
        )}

        <button type="submit" disabled={loading} style={{
          background: loading ? '#999' : 'linear-gradient(135deg,#F15A24,#c94b1a)',
          color: '#fff', border: 'none', borderRadius: 12, padding: '14px',
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: '0.2em',
          textTransform: 'uppercase',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: loading ? 'none' : '4px 4px 0 #401F5E',
          transition: 'all 0.15s',
        }}>
          {loading ? 'Authenticating…' : 'Access System →'}
        </button>
      </form>
    </div>
  );
}
