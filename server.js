import express from 'express';
import { getFusionSignals } from './fusionSignal.js';

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.json({
    message: 'FusionRun Cloud V10.8',
    version: 'V10.8_FusionSignal_FullCloud',
    endpoints: ['/api/signal', '/healthz', '/readyz'],
    now: new Date().toISOString()
  });
});

app.get('/api/signal', async (req, res) => {
  try {
    const signals = await getFusionSignals();
    res.json({ updated: new Date().toISOString(), version: 'V10.8_FusionSignal_FullCloud', signals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/healthz', (_, res) => res.json({ ok: true }));
app.get('/readyz',  (_, res) => res.json({ ready: true }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ FusionRun Cloud server running on port ${PORT}`);
});
