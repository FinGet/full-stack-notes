const jwt = require('jsonwebtoken')
const jwtAuth = require('koa-jwt')

const secret = 'it is a'

router.post('/login', async ctx =>{
  const {body} = ctx.request;

  // 数据库验证

  const userinfo = body.username
  ctx.body = {
    message: '登录成功',
    user: userinfo,
    token: jwt.sign({
      data: userinfo,
      exp: Math.floor(Date.now() / 1000) + 60*60,
    },secret)
  }
})

router.get("/getUser-token",
  jwtAuth({secret}),
  async ctx => {
  //获取session 
  ctx.body = {
    message: "获取数据成功",
    userinfo: ctx.state.user.data
  };
});