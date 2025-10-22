/**
 * FusionRun Cloud V10.8
 * fetchOkx.js — OKX + CoinGlass 组合接口（已更新 /api/pro/v1 路径）
 */

import fetch from 'node-fetch';

// ✅ 内置 CoinGlass API Key（可被环境变量覆盖）
const COINGLASS_KEY = process.env.COINGLASS_API_KEY || '71ff539b-a45f-4b3f-b982-f569799c30ef';

// OKX 基础地址
const OKX_BASE = 'https://www.okx.com';

/**
 * 通用 fetchJson 方法（带 UA 防封）
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
 * ✅ 组合接口逻辑：
 * 1️⃣ 优先从 CoinGlass 获取 FundingRate；
 * 2️⃣ 若 CoinGlass 超时或数据异常，则回退至 OKX；
 */
export async function getOkxFunding(instId = 'BTC-USDT-SWAP') {
  const symbol = instId.split('-')[0];

  // --- Step 1: 尝试 CoinGlass 接口（已更新为 /api/pro/v1/futures/funding_rates） ---
  try {
    const url = `https://open-api.coinglass.com/api/pro/v1/futures/funding_rates?symbol=${symbol}&exchange=OKX`;
    const cgRes = await fetch(url, { headers: { 'coinglassSecret': COINGLASS_KEY } });
    if (!cgRes.ok) throw new Error(`CoinGlass ${cgRes.status}`);
    const cgJson = await cgRes.json();

    const rate = cgJson?.data?.[0]?.fundingRate ?? cgJson?.data?.fundingRate;
    if (rate !== undefined && rate !== null) {
      return { fundingRate: Number(rate), source: 'CoinGlass' };
    }
  } catch (err) {
    console.log(`[CoinGlass Fallback] ${err.message}`);
  }

  // --- Step 2: 回退至 OKX 原生接口（防403 UA头） ---
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
 * ✅ 同时增加持仓 / OI 变化接口（已更新为 /api/pro/v1/futures/open_interest）
 */
export async function getOiDelta(symbol = 'BTC') {
  // 先试 CoinGlass
  try {
    const url = `https://open-api.coinglass.com/api/pro/v1/futures/open_interest?symbol=${symbol}&exchange=OKX`;
    const res = await fetch(url, { headers: { 'coinglassSecret': COINGLASS_KEY } });
    if (!res.ok) throw new Error(`CoinGlass ${res.status}`);
    const j = await res.json();
    const value = j?.data?.[0]?.value ?? j?.data?.value ?? 0;
    return { oiDelta: Number(value), source: 'CoinGlass' };
  } catch (e) {
    console.log(`[CoinGlass OIΔ Error] ${e.message}`);
  }

  // 再试 OKX（备用）
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
