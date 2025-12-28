const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const READY_DELAY = parseInt(process.env.READY_DELAY) || 3000;
let ready = false;

// Structured Logging for ELK
const logger = (level, message, meta = {}) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    service: 'backend',
    ...meta
  }));
};

setTimeout(() => {
  ready = true;
  logger('INFO', 'Backend ready state reached');
}, READY_DELAY);

app.get('/health', (req, res) => res.send('ok'));
app.get('/ready', (req, res) => {
  ready ? res.send('ready') : res.status(503).send('not ready');
});

app.get('/api', (req, res) => {
  logger('INFO', 'API access', { path: '/api', method: 'GET' });
  res.json({ status: 'ok', data: 'Hello from Production-grade Backend' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger('ERROR', 'Unhandled Exception', { error: err.message, stack: err.stack });
  res.status(500).send('Internal Server Error');
});

const server = app.listen(PORT, () => {
  logger('INFO', `Server listening on port ${PORT}`);
});

// Graceful Shutdown for K8s Zero-downtime
process.on('SIGTERM', () => {
  logger('WARN', 'SIGTERM received. Closing server...');
  server.close(() => {
    logger('INFO', 'Server closed. Exiting process.');
    process.exit(0);
  });
});