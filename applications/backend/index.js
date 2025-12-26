const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  console.log('🔥 ROOT HIT', new Date().toISOString())
  res.send('Backend is running')
})

app.get('/api', (req, res) => {
  console.log('🔥 API HIT', new Date().toISOString())
  res.json({ status: 'ok' })
})

app.get('/health', (req, res) => {
  res.send('ok')
})

app.listen(PORT, () => {
  console.log('🚀 Backend started on port ' + PORT)
})
