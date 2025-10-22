import fetch from 'node-fetch';
const OKX_BASE = 'https://www.okx.com';

export async function fetchJson(url, headers={}){
  const r = await fetch(url, { headers });
  if(!r.ok) throw new Error(`HTTP ${r.status} - ${url}`);
  return await r.json();
}

export async function getOkxFunding(instId='BTC-USDT-SWAP'){
  const url = `${OKX_BASE}/api/v5/public/funding-rate?instId=${encodeURIComponent(instId)}`;
  const j = await fetchJson(url);
  return j?.data?.[0] || null;
}
