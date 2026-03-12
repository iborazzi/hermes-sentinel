
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    if (!address || typeof address !== 'string') {
      return NextResponse.json({ error: 'Gecerli adres girin.' }, { status: 400 });
    }
    const trimmed = address.trim();
    const isEVM = /^0x[a-fA-F0-9]{40}$/.test(trimmed);
    const isENS = trimmed.endsWith('.eth');
    if (!isEVM && !isENS) {
      return NextResponse.json({ error: 'Gecersiz adres.' }, { status: 400 });
    }
    const apiKey = process.env.NOUS_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'API key yok.' }, { status: 500 });
    const sp = 'Respond ONLY with valid JSON: {"address":"x","riskScore":50,"riskLabel":"ORTA RISK","summary":"Analiz yapildi.","metrics":[{"label":"Islem Sayisi","value":"100","status":"good"},{"label":"Cuzdan Yasi","value":"1 yil","status":"good"},{"label":"DeFi Aktivitesi","value":"Medium","status":"warn"},{"label":"Token Cesitliligi","value":"5","status":"good"},{"label":"Son Aktivite","value":"2 gun","status":"good"},{"label":"Risk Sinyali","value":"Normal","status":"good"}],"advice":"Dikkatli olun."}';
    const response = await fetch('https://inference-api.nousresearch.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: 'Hermes-4-70B',
        messages: [
          { role: 'system', content: sp },
          { role: 'user', content: 'Analyze this wallet: ' + trimmed },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });
    if (!response.ok) {
      const err = await response.text();
      console.error('Nous API error:', err);
      return NextResponse.json({ error: 'Hermes yanit vermedi.' }, { status: 502 });
    }
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return NextResponse.json({ error: 'Bos yanit.' }, { status: 502 });
    try {
      const clean = content.replace(/```json|```/g, '').trim();
      return NextResponse.json(JSON.parse(clean));
    } catch {
      return NextResponse.json({ error: 'Parse hatasi.' }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: 'Sunucu hatasi.' }, { status: 500 });
  }
}