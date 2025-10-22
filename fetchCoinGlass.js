import fetch from 'node-fetch';

// ✅ 内置 CoinGlass API Key（可被环境变量覆盖）
const COINGLASS_KEY = process.env.COINGLASS_API_KEY || '71ff539b-a45f-4b3f-b982-f569799c30ef';

async function get(url){
  const r = await fetch(url, { headers: { 'coinglassSecret': COINGLASS_KEY }});
  if(!r.ok) throw new Error(`CoinGlass ${r.status} - ${url}`);
  const j = await r.json();
  if(j && j.success === false) throw new Error(`CoinGlass error: ${JSON.stringify(j)}`);
  return j;
}

export async function getFundingRate(symbol='BTC', exchange='OKX'){
  const u = `https://open-api.coinglass.com/api/futures/funding_rate?symbol=${symbol}&exchange=${exchange}`;
  const j = await get(u);
  return j?.data || [];
}

export async function getOiDelta(symbol='BTC'){
  const u = `https://open-api.coinglass.com/api/futures/openInterest?symbol=${symbol}`;
  const j = await get(u);
  return j?.data || [];
}
