'use client';
import { useState, useEffect } from 'react';

type Tab = 'analyze' | 'gm' | 'streak';

export default function HermesSentinel() {
  const [tab, setTab] = useState<Tab>('analyze');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [gmDone, setGmDone] = useState(false);
  const [gnDone, setGnDone] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const initSDK = async () => {
      try {
        const sdk: any = await import('@farcaster/miniapp-sdk');
        if (sdk && sdk.actions && sdk.actions.ready) {
          await sdk.actions.ready();
        } else if (sdk && sdk.default && sdk.default.actions) {
          await sdk.default.actions.ready();
        }
      } catch (e) {
        console.log('Not in Farcaster context');
      }
    };
    initSDK();
    try {
      const savedStreak = parseInt(localStorage.getItem('hs_streak') || '0');
      const lastDate = localStorage.getItem('hs_last_date');
      const today = new Date().toDateString();
      if (lastDate === today) {
        setStreak(savedStreak);
        setGmDone(localStorage.getItem('hs_gm') === today);
        setGnDone(localStorage.getItem('hs_gn') === today);
      } else {
        const newStreak = lastDate ? savedStreak + 1 : 1;
        setStreak(newStreak);
        localStorage.setItem('hs_streak', newStreak.toString());
        localStorage.setItem('hs_last_date', today);
      }
    } catch (e) {}
  }, []);

  const analyze = async () => {
    if (!address.trim() || loading) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address: address.trim() }) });
      const data = await res.json();
      if (data.error) setError(data.error); else setResult(data);
    } catch (e) { setError('Baglanti hatasi.'); }
    setLoading(false);
  };

  const doGM = () => {
    try { const today = new Date().toDateString(); localStorage.setItem('hs_gm', today); } catch(e) {}
    setGmDone(true);
    window.open('https://warpcast.com/~/compose?text=' + encodeURIComponent('GM! 🌅\n\nHermes Sentinel ile on-chain analizim hazır!\nhttps://hermes-sentinel.vercel.app\n\n/base @NousResearch'), '_blank');
  };

  const doGN = () => {
    try { const today = new Date().toDateString(); localStorage.setItem('hs_gn', today); } catch(e) {}
    setGnDone(true);
    window.open('https://warpcast.com/~/compose?text=' + encodeURIComponent('GN! 🌙\n\nBugün Hermes Sentinel ile cüzdan analizi yaptım!\nhttps://hermes-sentinel.vercel.app\n\n/base @NousResearch'), '_blank');
  };

  const tabStyle = (t: Tab) => ({
    flex: 1, padding: '10px', background: tab === t ? '#003322' : 'transparent',
    color: tab === t ? '#00ff88' : '#446', border: 'none', borderBottom: tab === t ? '2px solid #00ff88' : '2px solid transparent',
    cursor: 'pointer', fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold' as const
  });

  return (
    <div style={{ minHeight: '100vh', background: '#050a0f', color: 'white', fontFamily: 'monospace' }}>
      <div style={{ background: '#0a1628', borderBottom: '1px solid #0a3a2a', padding: '16px' }}>
        <h1 style={{ margin: 0, color: '#00ff88', fontSize: '18px', letterSpacing: '3px' }}>HERMES SENTINEL</h1>
        <p style={{ margin: '4px 0 0', color: '#006644', fontSize: '11px' }}>Nous Research - On-Chain Intelligence</p>
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid #0a3a2a' }}>
        <button onClick={() => setTab('analyze')} style={tabStyle('analyze')}>ANALIZ</button>
        <button onClick={() => setTab('gm')} style={tabStyle('gm')}>GM/GN</button>
        <button onClick={() => setTab('streak')} style={tabStyle('streak')}>STREAK</button>
      </div>
      <div style={{ padding: '16px' }}>
        {tab === 'analyze' && (
          <div>
            <input value={address} onChange={e => setAddress(e.target.value)} onKeyDown={e => e.key === 'Enter' && analyze()} placeholder="0x... wallet address" style={{ width: '100%', background: '#0a1628', border: '1px solid #0a3a2a', borderRadius: '6px', padding: '10px', color: '#00ff88', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }} />
            <button onClick={analyze} style={{ width: '100%', marginTop: '10px', background: '#003322', color: '#00ff88', border: '1px solid #00aa55', borderRadius: '6px', padding: '12px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace' }}>
              {loading ? 'Analiz ediliyor...' : 'ANALIZ ET'}
            </button>
            {error && <p style={{ color: '#ff4444' }}>{error}</p>}
            {loading && <p style={{ color: '#00ff88', textAlign: 'center' }}>Hermes Agent tariyor...</p>}
            {result && !loading && (
              <div style={{ background: '#0a1628', border: '1px solid #00ff8844', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
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
                <button onClick={() => window.open('https://warpcast.com/~/compose?text=' + encodeURIComponent('Hermes Sentinel Risk: ' + result.riskScore + '/100 ' + result.riskLabel + ' ' + result.summary + ' https://hermes-sentinel.vercel.app @NousResearch'), '_blank')} style={{ width: '100%', background: '#1a0a3a', color: '#c090ff', border: '1px solid #4a1a8a', borderRadius: '6px', padding: '10px', cursor: 'pointer', fontFamily: 'monospace', marginTop: '8px' }}>
                  Farcaster da Paylas
                </button>
              </div>
            )}
          </div>
        )}
        {tab === 'gm' && (
          <div>
            <p style={{ color: '#006644', fontSize: '12px', marginTop: 0 }}>Gunluk Base etkilesimi ile streak kazan!</p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button onClick={doGM} disabled={gmDone} style={{ flex: 1, background: gmDone ? '#0a1628' : '#003322', color: gmDone ? '#224' : '#00ff88', border: '1px solid #00aa55', borderRadius: '8px', padding: '20px', cursor: gmDone ? 'not-allowed' : 'pointer', fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold' }}>
                GM<br/><span style={{ fontSize: '10px' }}>{gmDone ? 'Yapildi' : 'Cast at'}</span>
              </button>
              <button onClick={doGN} disabled={gnDone} style={{ flex: 1, background: gnDone ? '#0a1628' : '#1a0a3a', color: gnDone ? '#224' : '#c090ff', border: '1px solid #4a1a8a', borderRadius: '8px', padding: '20px', cursor: gnDone ? 'not-allowed' : 'pointer', fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold' }}>
                GN<br/><span style={{ fontSize: '10px' }}>{gnDone ? 'Yapildi' : 'Cast at'}</span>
              </button>
            </div>
            <div style={{ background: '#0a1628', border: '1px solid #0a3a2a', borderRadius: '8px', padding: '16px' }}>
              <p style={{ color: '#006644', fontSize: '10px', margin: '0 0 8px' }}>BUGUNKU GOREVLER</p>
              <p style={{ color: gmDone ? '#00ff88' : '#446', fontSize: '13px', margin: '4px 0' }}>{gmDone ? 'V' : 'O'} GM cast at</p>
              <p style={{ color: gnDone ? '#00ff88' : '#446', fontSize: '13px', margin: '4px 0' }}>{gnDone ? 'V' : 'O'} GN cast at</p>
            </div>
          </div>
        )}
        {tab === 'streak' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#0a1628', border: '1px solid #0a3a2a', borderRadius: '12px', padding: '32px 16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#ff8800' }}>{streak}</div>
              <div style={{ color: '#884400', fontSize: '14px', letterSpacing: '2px' }}>GUN STREAK</div>
            </div>
            <div style={{ background: '#0a1628', border: '1px solid #0a3a2a', borderRadius: '8px', padding: '16px', textAlign: 'left' }}>
              <p style={{ color: '#006644', fontSize: '10px', margin: '0 0 10px' }}>STREAK NASIL KAZANILIR</p>
              <p style={{ color: '#446', fontSize: '12px', margin: '6px 0' }}>Her gun GM cast at</p>
              <p style={{ color: '#446', fontSize: '12px', margin: '6px 0' }}>Her gun GN cast at</p>
              <p style={{ color: '#446', fontSize: '12px', margin: '6px 0' }}>Cuzdan analizi yap</p>
            </div>
          </div>
        )}
      </div>
      <p style={{ color: '#112', fontSize: '10px', textAlign: 'center', padding: '16px' }}>Hermes Sentinel - Nous Research Hackathon 2026</p>
    </div>
  );
}
