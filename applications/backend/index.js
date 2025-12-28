const express = require('express');
const app = express();

// ข้อ 1: ใช้ Config จาก Environment Variables (ConfigMaps)
const PORT = process.env.PORT || 3000;
const READY_DELAY = parseInt(process.env.READY_DELAY) || 3000;
let ready = false;

// ฟังก์ชันสำหรับ Standard JSON Logging (ช่วยให้ ELK/Loki อ่านง่าย)
const logger = (level, message, meta = {}) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  }));
};

setTimeout(() => {
  ready = true;
  logger('INFO', 'Backend is ready to serve traffic');
}, READY_DELAY);

app.get('/', (req, res) => {
  logger('INFO', 'Root endpoint hit', { path: '/', method: 'GET' });
  res.send('Backend is running');
});

app.get('/api', (req, res) => {
  logger('INFO', 'API endpoint hit', { path: '/api', method: 'GET' });
  res.json({ status: 'ok', version: '1.0.0' });
});

// Liveness & Readiness Probes
app.get('/health', (req, res) => res.send('ok'));
app.get('/ready', (req, res) => {
  ready ? res.send('ready') : res.status(503).send('not ready');
});

// ข้อ 3: Global Error Handling Middleware
app.use((err, req, res, next) => {
  logger('ERROR', err.message, { stack: err.stack });
  res.status(500).json({ error: 'Internal Server Error' });
});

// ข้อ 4: 404 Handler
app.use((req, res) => {
  logger('WARN', 'Route not found', { path: req.path });
  res.status(404).json({ error: 'Not Found' });
});

const server = app.listen(PORT, () => {
  logger('INFO', `Server started on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger('WARN', 'SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger('INFO', 'Process terminated');
    process.exit(0);
  });
});