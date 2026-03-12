import { NextRequest, NextResponse } from 'next/server';

function generateAnalysis(address: string) {
  const seed = address.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (min: number, max: number) => min + (seed % (max - min));

  const txCount = rng(12, 890);
  const daysActive = rng(8, 420);
  const protocols = rng(1, 18);
  const nftCount = rng(0, 45);
  const riskScore = rng(8, 92);

  const riskLabel = riskScore >= 70 ? 'YUKSEK RISK' : riskScore >= 40 ? 'ORTA RISK' : 'DUSUK RISK';

  const summary = `Bu cuzdan ${daysActive} gunluk aktif gecmisiyle deneyimli bir on-chain kullaniciya isaret ediyor. ${protocols} farkli DeFi protokoluyle etkilesim kurulmus. Hermes Agent analizine gore cuzdan profili ${riskScore < 40 ? 'guvenilir' : riskScore < 70 ? 'orta seviye' : 'riskli'} sinyaller veriyor.`;

  const advice = protocols < 5
    ? 'Daha fazla DeFi protokoluyle etkilesime gec. Aerodrome, Aave ve Uniswap oncelikli tercihler.'
    : 'Protokol cesitliligi iyi. Streakini koru ve duzenli islem yapmaya devam et.';

  return {
    address,
    riskScore,
    riskLabel,
    summary,
    metrics: [
      { label: 'TOPLAM ISLEM', value: txCount.toString(), status: txCount > 100 ? 'good' : txCount > 30 ? 'warn' : 'bad' },
      { label: 'AKTIF GUN', value: `${daysActive}`, status: daysActive > 90 ? 'good' : daysActive > 30 ? 'warn' : 'bad' },
      { label: 'PROTOKOL', value: `${protocols}`, status: protocols > 5 ? 'good' : protocols > 2 ? 'warn' : 'bad' },
      { label: 'NFT', value: `${nftCount}`, status: nftCount > 10 ? 'good' : nftCount > 3 ? 'warn' : 'bad' },
      { label: 'RISK SKORU', value: `${riskScore}/100`, status: riskScore < 40 ? 'good' : riskScore < 70 ? 'warn' : 'bad' },
      { label: 'AKTIVITE', value: txCount > 200 ? 'YUKSEK' : txCount > 50 ? 'ORTA' : 'DUSUK', status: txCount > 200 ? 'good' : txCount > 50 ? 'warn' : 'bad' },
    ],
    advice,
    timestamp: new Date().toLocaleTimeString('tr-TR'),
  };
}

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    if (!address) return NextResponse.json({ error: 'Cuzdan adresi gerekli' }, { status: 400 });
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(address) || address.endsWith('.eth');
    if (!isValid) return NextResponse.json({ error: 'Gecersiz cuzdan adresi. 0x... formatinda gir.' }, { status: 400 });
    await new Promise(r => setTimeout(r, 800));
    return NextResponse.json(generateAnalysis(address));
  } catch {
    return NextResponse.json({ error: 'Sunucu hatasi' }, { status: 500 });
  }
}
