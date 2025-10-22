/**
 * FusionRun Cloud V10.8 × CoinGlass v4 整合接口
 * ----------------------------------------------------------
 * Funding & OI 来自 CoinGlass v4
 * 价格、成交量、标记价、K线、Ticker 来自 OKX v5
 * 环境变量 COINGLASS_API_KEY 需在 Render 中配置
 * ----------------------------------------------------------
 */

import fetch from "node-fetch";

// ========================
// 环境配置
// ========================
const COINGLASS_KEY =
  process.env.COINGLASS_API_KEY || "9f226814f73143698787db80f645ec2f";
const GLASS_BASE = "https://open-api-v4.coinglass.com";
const OKX_BASE = "https://www.okx.com";

/**
 * 通用 fetchJson 函数 (带 UA 防 403)
 */
async function fetchJson(url, headers = {}) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "FusionRunCloud/1.0",
      Accept: "application/json",
      ...headers,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${url}`);
  return res.json();
}

// ========================
//  CoinGlass v4 Funding Rate
// ========================
export async function getFundingRate(symbol = "BTC", exchange = "OKX") {
  const url = `${GLASS_BASE}/api/futures/funding_rates?symbol=${symbol}&exchange=${exchange}`;
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "CG-API-KEY": COINGLASS_KEY,
        "User-Agent": "FusionRunCloud/1.0",
      },
    });
    if (!res.ok) throw new Error(`CoinGlass HTTP ${res.status}`);
    const data = await res.json();
    const rate = data?.data?.[0]?.fundingRate ?? data?.data?.fundingRate ?? 0;
    console.log("[Funding]", symbol, rate);
    return { fundingRate: Number(rate), source: "CoinGlass v4" };
  } catch (err) {
    console.log("[Funding Error]", err.message);
    return { fundingRate: null, source: "CoinGlass Error" };
  }
}

// ========================
//  CoinGlass v4 Open Interest
// ========================
export async function getOpenInterest(symbol = "BTC", exchange = "OKX") {
  const url = `${GLASS_BASE}/api/futures/open_interest?symbol=${symbol}&exchange=${exchange}`;
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "CG-API-KEY": COINGLASS_KEY,
        "User-Agent": "FusionRunCloud/1.0",
      },
    });
    if (!res.ok) throw new Error(`CoinGlass HTTP ${res.status}`);
    const data = await res.json();
    const value = data?.data?.[0]?.value ?? 0;
    console.log("[OI]", symbol, value);
    return { oi: Number(value), source: "CoinGlass v4" };
  } catch (err) {
    console.log("[OI Error]", err.message);
    return { oi: null, source: "CoinGlass Error" };
  }
}

// ========================
//  OKX 接口 (行情主数据)
// ========================
async function okxGet(path) {
  const url = `${OKX_BASE}${path}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "FusionRunCloud/1.0", Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`OKX HTTP ${res.status}`);
  return res.json();
}

export async function getOkxTicker(instId = "BTC-USDT-SWAP") {
  const j = await okxGet(`/api/v5/market/ticker?instId=${instId}`);
  const d = j?.data?.[0] || {};
  return {
    last: Number(d.last ?? 0),
    vol24h: Number(d.vol24h ?? 0),
    high24h: Number(d.high24h ?? 0),
    low24h: Number(d.low24h ?? 0),
    open24h: Number(d.open24h ?? 0),
  };
}

export async function getOkxOpenInterest(instId = "BTC-USDT-SWAP") {
  const j = await okxGet(`/api/v5/public/open-interest?instId=${instId}`);
  const d = j?.data?.[0] || {};
  return { oi: Number(d.oi ?? 0), ts: Number(d.ts ?? 0) };
}

export async function getOkxMarkPrice(instId = "BTC-USDT-SWAP") {
  const j = await okxGet(`/api/v5/public/mark-price?instId=${instId}`);
  const d = j?.data?.[0] || {};
  return { markPx: Number(d.markPx ?? 0), ts: Number(d.ts ?? 0) };
}

export async function getOkxCandles(instId = "BTC-USDT-SWAP", bar = "3600", limit = 200) {
  const j = await okxGet(
    `/api/v5/market/candles?instId=${instId}&bar=${bar}&limit=${limit}`
  );
  return Array.isArray(j?.data) ? j.data : [];
}

// ========================
// 导出统一接口
// ========================
export { fetchJson };
