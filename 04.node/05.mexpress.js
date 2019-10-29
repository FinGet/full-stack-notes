const http = require('http')
const url = require('url')

const router = []
class Application {
  get(path, handler){
    router.push({
      path,
      method: 'get',
      handler
    })
  }

  listen() {
    const server = http.createServer((req, res) => {
      const {pathname} = url.parse(req.url, true)
      router.find(item => pathname === item.path && req.method.toLowerCase() === item.method).handler(req,res)
      // for(const item of router) {
      //   if(pathname === item.path && req.method.toLowerCase() === item.method){
      //     return item.handler(req, res)
      //   }
      // }
    })

    server.listen(...arguments)
  }
}

module.exports = function createApplication(){
  return new Application()
}