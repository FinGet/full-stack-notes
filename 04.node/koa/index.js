const Koa = require('koa')

const app = new Koa()

app.use(async (ctx,next) => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  console.log(`输出计时：${ctx.method} ${ctx.url} - ${rt}`)
})

app.use(async (ctx,next) => {
  const start = Date.now()
  console.log('开始计时')
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time',`${ms}ms`)
  console.log('结束')
})

app.listen(4000)