import { TH } from './thresholds.js';
import { numOk } from './utils.js';

// ⚠️ 为确保“完全不改变”策略，请将你 V10.8 的打分与分级逻辑粘贴替换此函数内容
export function composeSignal(metrics){
  const { rsi=50, funding=0, oiDelta=0, vol5=0, vol10=0, wave='第1浪' } = metrics;

  // 简化占位映射（便于后续 1:1 替换为 V10.8 计算）
  let signal = '⚖️ 中性';
  let score = 0.5;

  if(rsi >= TH.RSI_STRONG && funding >= 0 && oiDelta >= TH.OI_DELTA_POS){
    signal = '💎 趋势叠浪共振强多';
    score = 0.84;
  }else if(rsi >= 55 && vol5 > TH.VOLDELTA_5){
    signal = '💚 吸筹启动';
    score = 0.73;
  }else if(rsi <= TH.RSI_WEAK && funding <= 0 && oiDelta <= TH.OI_DELTA_NEG){
    signal = '⚠️ 震荡转弱';
    score = 0.32;
  }

  return { signal, score: numOk(score, 2) };
}
