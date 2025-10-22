import express from 'express';
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from FusionRun Node.js on Render!',
    version: 'V11.3_FusionRun',
    env: {
      APP_NAME: process.env.APP_NAME || 'FusionRun',
      APP_MODE: process.env.APP_MODE || 'dev',
      PORT: PORT
    },
    now: new Date().toISOString()
  });
});

app.get('/healthz', (req, res) => res.json({ ok: true }));
app.get('/readyz', (req, res) => res.json({ ready: true }));
app.get('/api/ping', (req, res) => res.json({ ping: 'pong' }));

app.listen(PORT, () => console.log(`FusionRun service listening on port ${PORT}`));
