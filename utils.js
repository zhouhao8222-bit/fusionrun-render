export const timeCN = () => new Date().toLocaleString('zh-CN', { hour12: false });
export const numOk = (v, d=4) => (typeof v === 'number' && isFinite(v)) ? Number(v.toFixed(d)) : null;
export const toOkxId = (base, quote='USDT', typ='SWAP') => `${base}-${quote}-${typ}`;
