'use client';
import { useState } from 'react';

export default function HermesSentinel() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!address.trim() || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address.trim() }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch (e) {
      setError('Bağlantı hatası oluştu.');
    }
    setLoading(false);
  };

  const rc = (s: number) => (s >= 70 ? '#ff4444' : s >= 40 ? '#ffaa00' : '#44ff88');
  const sc = (s: string) => (s === 'good' ? '#44ff88' : s === 'warn' ? '#ffaa00' : '#ff4444');

  return (
    <div style={{ minHeight: '100vh', background: '#050a0f', color: 'white', fontFamily: 'monospace' }}>
      <div style={{ background: '#0a1628', borderBottom: '1px solid #0a3a2a', padding: '20px 16px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, color: '#00ff88', fontSize: '20px', letterSpacing: '3px' }}>🛡️ HERMES SENTINEL</h1>
          <p style={{ margin: '4px 0 0', color: '#006644', fontSize: '11px' }}>ON-CHAIN WALLET INTELLIGENCE - Nous Research</p>
        </div>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '16px' }}>
        <div style={{ background: '#0a1628', border: '1px solid #0a3a2a', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <p style={{ color: '#00aa55', fontSize: '11px', marginBottom: '8px' }}>CÜZDAN ADRESİ GİR</p>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyze()}
            placeholder="0x... veya ENS"
            style={{ width: '100%', background: '#050a0f', border: '1px solid #0a3a2a', borderRadius: '6px', padding: '10px', color: '#00ff88', outline: 'none', boxSizing: 'border-box' }}
          />
          <button
            onClick={analyze}
            disabled={loading || !address.trim()}
            style={{ width: '100%', marginTop: '10px', background: '#003322', color: '#00ff88', border: '1px solid #00aa55', borderRadius: '6px', padding: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'Analiz ediliyor...' : 'ANALİZ ET'}
          </button>
        </div>

        {error && <div style={{ color: '#ff4444', marginBottom: '16px' }}>⚠️ {error}</div>}

        {result && (
          <div style={{ background: '#0a1628', border: `1px solid ${rc(result.riskScore)}44`, borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <p style={{ margin: 0, color: '#006633', fontSize: '10px' }}>CÜZDAN</p>
                <p style={{ margin: 0, color: '#00ff88' }}>{result.address.slice(0, 8)}...{result.address.slice(-6)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: rc(result.riskScore) }}>{result.riskScore}</div>
                <div style={{ fontSize: '10px', color: rc(result.riskScore) }}>{result.riskLabel}</div>
              </div>
            </div>
            <p style={{ color: '#aaccaa', fontSize: '13px', lineHeight: '1.5' }}>{result.summary}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '12px 0' }}>
              {result.metrics.map((m: any, i: number) => (
                <div key={i} style={{ background: '#050a0f', borderRadius: '6px', padding: '8px', border: `1px solid ${sc(m.status)}22` }}>
                  <p style={{ margin: 0, color: '#446', fontSize: '10px' }}>{m.label}</p>
                  <p style={{ margin: 0, color: sc(m.status), fontSize: '12px', fontWeight: 'bold' }}>{m.value}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(`🛡️ Hermes Sentinel Analizi\n\nCüzdan: ${result.address}\nRisk Skoru: ${result.riskScore}/100\n\n@NousResearch #HermesSentinel`)}`, '_blank')}
              style={{ width: '100%', background: '#1a0a3a', color: '#c090ff', border: '1px solid #4a1a8a', borderRadius: '6px', padding: '10px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              🟣 Farcaster'da Paylaş
            </button>
          </div>
        )}
      </div>
    </div>
  );
}