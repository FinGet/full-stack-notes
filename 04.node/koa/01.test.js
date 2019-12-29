const Koa = require('koa')

const app = new Koa()

const mid1 = async (ctx, next) => {
  // 洋葱第一层
  ctx.body = "hello,"
  await next()
  // 出洋葱时
  ctx.body += '!!!'
}

const mid2 = async (ctx, next) => {
  // 洋葱第二层
  ctx.type = 'text/html;charset=utf-8'
  await next();
}
const mid3 = async (ctx, next) => {
  // 洋葱第三层
  ctx.body += 'finget'
}

app.use(mid1)
app.use(mid2)
app.use(mid3)

app.listen(4000)

// hello,finget!!!