import { getOkxFunding } from './fetchOkx.js';
import { getFundingRate, getOiDelta } from './fetchCoinGlass.js';
import { composeSignal } from './fusionCore.js';
import { toOkxId } from './utils.js';

const PAIRS = ['BTC', 'ETH', 'SOL']; // ← 与 V10.8 列表对齐时可替换

// ⚠️ 占位：这里应为 V10.8 的 VOL5/10、EMA、RSI、Funding/OIΔ/CVD/LSP、八浪周期计算
async function computeMetricsFor(symbol){
  const instId = toOkxId(symbol);
  const okxFunding = await getOkxFunding(instId);
  await getFundingRate(symbol); // 预热请求（保持接口一致）
  await getOiDelta(symbol);

  const funding = Number(okxFunding?.fundingRate || 0) || 0;
  const rsi = 60;       // ← 替换为 V10.8
  const vol5 = 0.2;     // ← 替换为 V10.8
  const vol10 = 0.1;    // ← 替换为 V10.8
  const oiDelta = 0.03; // ← 替换为 V10.8
  const wave = '第3浪'; // ← 替换为 V10.8

  return { symbol, instId, rsi, funding, vol5, vol10, oiDelta, wave };
}

export async function getFusionSignals(){
  const rows = [];
  for(const s of PAIRS){
    try{
      const m = await computeMetricsFor(s);
      const c = composeSignal(m);
      rows.push({
        Pair: m.instId,
        Type: '👑',
        Signal: c.signal,
        Funding: m.funding,
        CVD: null,
        VOLΔ: m.vol5,
        OIΔ: m.oiDelta,
        RSI: m.rsi,
        Wave: m.wave,
        FusionScore: c.score,
        更新时间: new Date().toLocaleString('zh-CN', { hour12: false })
      });
    }catch(e){
      rows.push({ Pair: toOkxId(s), Type: '❌', Signal: `错误: ${e.message}` });
    }
  }
  return rows;
}
