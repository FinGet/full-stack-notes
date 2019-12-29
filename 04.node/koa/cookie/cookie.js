const http = require('http')

const server = http.createServer((req, res) => {
  const sessionKey = 'sid'
  const seesion = {}
  if(req.url === '/favicon.ico') {
    return
  } else {
    // console.log('cookie', req.headers.cookie)
    // res.setHeader('Set-Cookie','name=finget'); // 在浏览器的Application中会注入一条cookie;
    // 在response headers 中会有Set-Cookie: name=finget，再次请求时，request headers 中会有Cookie: name=finget
    // res.setHeader('Set-Cookie','age=24;HttpOnly'); // 有了HttpOnly 客户端就无法通过document.cookie拿到这个cookie
    // res.end('hello cookie')

    const cookie = req.headers.cookie;
    const sid = (Math.random()*9999999).toFixed()

    if(cookie && cookie.indexOf(sessionKey) > -1){
      console.log('cookie', req.headers.cookie)
      res.end('come back')
    } else {
      res.setHeader('Set-Cookie',`${sessionKey}=${sid}`);
      seesion[sid] = {name: 'finget'}
      res.end('hello cookie')
    }

  }
})

server.listen(3000)
