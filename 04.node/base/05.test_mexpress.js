const express = require('./05.mexpress')

const app = express()

app.get('/', (req, res) => {
  res.setHeader('Content-Type','text/plain;charset=utf-8')
  res.end('我的express')
})

app.listen(3300)