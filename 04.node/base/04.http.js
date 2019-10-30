const http = require('http');
const fs = require('fs')
const server = http.createServer((req, res) => {

  let {url, method, headers} = req;
  // console.log('request', res);
  console.log(url, method);

  if(url === '/' && method === 'GET') {
    fs.readFile('./test.html', (err, data) => {
      if(err) {
        res.writeHead(500, {'Content-Type': 'text/plain;charset=utf-8'})
        res.end('server error 错误')
      } else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html')
        res.setHeader('Set-Cookie', [ 'mycookie1=value1',  'mycookie2=value2'])
        res.end(data)
      }
    })
  } else if(url === '/users' && method === 'GET'){
    res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'})
    res.end(JSON.stringify({name:'finget'}))
  } else if( url !== '/favicon.ico' && method === 'GET' && headers.accept.indexOf('image/*')!== -1 ){
    fs.createReadStream('.' + url).pipe(res)
  }
})

server.listen(4000)