import express from 'express';
const app = express();

// ✅ Render 要求使用平台分配的端口
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from FusionRun Node.js on Render!',
    version: 'V11.3_FusionRun',
    env: {
      APP_NAME: process.env.APP_NAME || 'FusionRun',
      APP_MODE: process.env.APP_MODE || 'production',
      PORT: PORT
    },
    now: new Date().toISOString()
  });
});

app.get('/healthz', (req, res) => res.json({ ok: true }));
app.get('/readyz', (req, res) => res.json({ ready: true }));
app.get('/api/ping', (req, res) => res.json({ ping: 'pong' }));

// ✅ 关键：监听 Render 提供的端口
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ FusionRun service listening on port ${PORT}`);
});
