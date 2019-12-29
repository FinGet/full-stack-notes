const koa = require('koa');
const app = new koa();
const session = require('koa-session');
const redisStore = require('koa-redis');
const redis = require('redis');
// 注意: client默认是异步callback方式调用;
// store.client是经过了co-redis包装,返回Promise, 在koa里面用yield异步编程比较方便
const client = redis.createClient(6379, "172.19.65.240");

// signed = false 时，app.keys 不赋值没有关系；如果 signed: true 时，则需要对 app.keys 赋值，
// 否则会报错。作用是将 cookie 的内容通过密钥进行加密，在 check 登录时，
// 保证 cookie 内容未被修改，如果被修改了，则校验登录失败
app.keys = ['some secret', 'another secret'];

// const options = {client: client, db: 1};
const store = redisStore({client: client, db: 'test'});
const SESS_CONFIG = {
  key: 'kkb:sess', // 键名
  // maxAge: 86400000, // 有效期
  httpOnly: true, // 服务器有效
  signed: true, // 签名
  store: store
};

app.use(session(SESS_CONFIG, app))

app.use(ctx => {
  if (ctx.path === '/favicon.ico') return; 
  let n = ctx.session.count || 0; 
  console.log(ctx.session);
  ctx.session.count = ++n;
  ctx.body = '第' + n + '次访问';
});
app.listen(3000)