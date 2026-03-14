'use client';
import { useState, useEffect } from 'react';

export default function HermesSentinel() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const initSDK = async () => {
      try {
        const sdk = await import('@farcaster/miniapp-sdk');
        await sdk.actions.ready();
      } catch (e) {
        console.log('Not in Farcaster context');
      }
    };
    initSDK();
  }, []);

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
      setError('Baglanti hatasi.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050a0f', color: 'white', fontFamily: 'monospace', padding: '16px' }}>
      <h1 style={{ color: '#00ff88' }}>🛡️ HERMES SENTINEL</h1>
      <p style={{ color: '#006644', fontSize: '12px' }}>Nous Research - On-Chain Wallet Intelligence</p>
      <input
        value={address}
        onChange={e => setAddress(e.target.value)}
        placeholder="0x... wallet address"
        style={{ width: '100%', background: '#0a1628', border: '1px solid #0a3a2a', borderRadius: '6px', padding: '10px', color: '#00ff88', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box', marginTop: '16px' }}
      />
      <button
        onClick={analyze}
        style={{ width: '100%', marginTop: '10px', background: '#003322', color: '#00ff88', border: '1px solid #00aa55', borderRadius: '6px', padding: '12px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace' }}
      >
        {loading ? 'Analiz ediliyor...' : 'ANALIZ ET'}
      </button>
      {error && <p style={{ color: '#ff4444' }}>{error}</p>}
      {loading && <p style={{ color: '#00ff88', textAlign: 'center' }}>⚕️ Hermes Agent tarıyor...</p>}
      {result && !loading && (
        <div style={{ background: '#0a1628', border: '1px solid #00ff8844', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ color: '#00ff88', margin: 0 }}>{result.address.slice(0, 8)}...{result.address.slice(-6)}</p>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#44ff88' }}>{result.riskScore}</div>
              <div style={{ fontSize: '10px', color: '#44ff88' }}>{result.riskLabel}</div>
            </div>
          </div>
          <p style={{ color: '#aaccaa', fontSize: '13px', lineHeight: '1.5' }}>{result.summary}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '12px 0' }}>
            {result.metrics && result.metrics.map((m: any, i: number) => (
              <div key={i} style={{ background: '#050a0f', borderRadius: '6px', padding: '8px' }}>
                <p style={{ margin: 0, color: '#446', fontSize: '10px' }}>{m.label}</p>
                <p style={{ margin: '3px 0 0', color: '#44ff88', fontWeight: 'bold' }}>{m.value}</p>
              </div>
            ))}
          </div>
          <p style={{ color: '#88bbaa', fontSize: '12px' }}>{result.advice}</p>
          <button
            onClick={() => window.open('https://warpcast.com/~/compose?text=' + encodeURIComponent('🛡️ Hermes Sentinel\nRisk: ' + result.riskScore + '/100 ' + result.riskLabel + '\n' + result.summary + '\n\n@NousResearch'), '_blank')}
            style={{ width: '100%', background: '#1a0a3a', color: '#c090ff', border: '1px solid #4a1a8a', borderRadius: '6px', padding: '10px', cursor: 'pointer', fontFamily: 'monospace', marginTop: '8px' }}
          >
            🟣 Farcaster&apos;da Paylaş
          </button>
        </div>
      )}
      <p style={{ color: '#224', fontSize: '10px', textAlign: 'center', marginTop: '20px' }}>Hermes Sentinel — Nous Research Hackathon 2026 — iborazzi</p>
    </div>
  );
}
