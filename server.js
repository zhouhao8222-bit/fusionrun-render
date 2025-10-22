// server.js (最前面添加)
import express from 'express';
const app = express();
const PORT = process.env.PORT || 10000;

// ✅ 加入快速返回接口，让 Render 判定成功
app.get('/', (req, res) => res.json({ status: 'ok', service: 'FusionRun Cloud' }));

// ✅ 延迟启动异步任务（异步执行，不阻塞启动）
import('./fusionSignal.js').then(module => {
  const { getFusionSignals } = module;
  app.get('/api/signal', async (req, res) => {
    try {
      const signals = await getFusionSignals();
      res.json({ updated: new Date().toISOString(), signals });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

// ✅ 马上启动监听（Render只看这一句）
app.listen(PORT, () => console.log(`✅ FusionRun Cloud running on ${PORT}`));

// =============== 调试路由：OKX 主行情 ===============
import { getOkxTicker, getOkxOpenInterest, getOkxMarkPrice } from './fetchOkx.js';

app.get('/debug/okx', async (req, res) => {
  try {
    const instId = req.query.instId || 'BTC-USDT-SWAP';
    const [ticker, oi, mark] = await Promise.all([
      getOkxTicker(instId),
      getOkxOpenInterest(instId),
      getOkxMarkPrice(instId)
    ]);
    res.json({ instId, ticker, oi, mark });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============== 调试路由：Funding (CoinGlass v4) ===============
import { getFundingRate } from './fetchOkx.js';

app.get('/debug/funding', async (req, res) => {
  try {
    const symbol = req.query.symbol || 'BTC';
    const data = await getFundingRate(symbol, 'OKX');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
