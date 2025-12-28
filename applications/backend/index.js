const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000
let ready = false

// Simulate init เช่น DB / cache
setTimeout(() => {
  ready = true
  console.log('✅ Backend is ready')
}, 3000)

app.get('/', (req, res) => {
  console.log('🔥 ROOT HIT', new Date().toISOString())
  res.send('Backend is running')
})

app.get('/api', (req, res) => {
  console.log('🔥 API HIT', new Date().toISOString())
  res.json({ status: 'ok' })
})

// Liveness probe
app.get('/health', (req, res) => {
  res.send('ok')
})

// Readiness probe
app.get('/ready', (req, res) => {
  ready ? res.send('ready') : res.status(503).send('not ready')
})

const server = app.listen(PORT, () => {
  console.log('🚀 Backend started on port ' + PORT)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down')
  server.close(() => {
    process.exit(0)
  })
})
