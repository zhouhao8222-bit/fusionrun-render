/**
 * FusionRun Cloud V10.8 (2025)
 * fetchOkx.js — OKX + CoinGlass 组合接口（已升级至 /api/v2 路径）
 */

import fetch from 'node-fetch';

// ✅ 内置 CoinGlass API Key（可被环境变量覆盖）
const COINGLASS_KEY = process.env.COINGLASS_API_KEY || '71ff539b-a45f-4b3f-b982-f569799c30ef';

// ✅ OKX 基础地址
const OKX_BASE = 'https://www.okx.com';

/**
 * 通用 fetchJson 方法（带 UA 防封 + 错误检查）
 */
async function fetchJson(url, headers = {}) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'FusionRunCloud/1.0',
      'Accept': 'application/json',
      ...headers,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${url}`);
  return await res.json();
}

/**
 * ✅ Funding Rate 获取逻辑：
 * 1️⃣ 优先从 CoinGlass /api/v2/futures/funding 获取；
 * 2️⃣ 若 CoinGlass 超时或异常，则回退到 OKX 原生接口；
 */
export async function getOkxFunding(instId = 'BTC-USDT-SWAP') {
  const symbol = instId.split('-')[0];

  // --- Step 1: CoinGlass 主接口 (v2) ---
  try {
    const url = `https://open-api.coinglass.com/api/v2/futures/funding?symbol=${symbol}&exchange=OKX`;
    const cgRes = await fetch(url, { headers: { 'coinglassSecret': COINGLASS_KEY } });
    if (!cgRes.ok) throw new Error(`CoinGlass ${cgRes.status}`);
    const cgJson = await cgRes.json();

    // 数据结构兼容 v2
    const list = Array.isArray(cgJson?.data) ? cgJson.data : [];
    const rate = list[0]?.fundingRate ?? cgJson?.data?.fundingRate;

    if (rate !== undefined && rate !== null) {
      return { fundingRate: Number(rate), source: 'CoinGlass' };
    }
  } catch (err) {
    console.log(`[CoinGlass Fallback] ${err.message}`);
  }

  // --- Step 2: OKX 回退接口 ---
  try {
    const okxUrl = `${OKX_BASE}/api/v5/public/funding-rate?instId=${encodeURIComponent(instId)}`;
    const okxJson = await fetchJson(okxUrl);
    const data = okxJson?.data?.[0];
    if (data) {
      return { fundingRate: Number(data.fundingRate), source: 'OKX' };
    }
  } catch (err) {
    console.log(`[OKX Fallback Error] ${err.message}`);
  }

  // --- Step 3: 全部失败时返回空 ---
  return { fundingRate: null, source: 'None' };
}

/**
 * ✅ OI（持仓量变化）获取逻辑：
 * 1️⃣ 优先从 CoinGlass /api/v2/futures/openInterest；
 * 2️⃣ 若失败则回退到 OKX；
 */
export async function getOiDelta(symbol = 'BTC') {
  try {
    const url = `https://open-api.coinglass.com/api/v2/futures/openInterest?symbol=${symbol}&exchange=OKX`;
    const res = await fetch(url, { headers: { 'coinglassSecret': COINGLASS_KEY } });
    if (!res.ok) throw new Error(`CoinGlass ${res.status}`);
    const j = await res.json();

    const list = Array.isArray(j?.data) ? j.data : [];
    const value = list[0]?.openInterest ?? j?.data?.value ?? 0;

    if (value) return { oiDelta: Number(value), source: 'CoinGlass' };
  } catch (e) {
    console.log(`[CoinGlass OIΔ Error] ${e.message}`);
  }

  // --- OKX 备用接口 ---
  try {
    const url = `${OKX_BASE}/api/v5/public/open-interest?instId=${symbol}-USDT-SWAP`;
    const j = await fetchJson(url);
    const v = j?.data?.[0]?.oi ?? 0;
    return { oiDelta: Number(v), source: 'OKX' };
  } catch (e) {
    console.log(`[OKX OIΔ Error] ${e.message}`);
  }

  return { oiDelta: 0, source: 'None' };
}

/**
 * ✅ 通用导出（兼容旧结构）
 */
export { fetchJson };
