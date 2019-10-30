const net = require('net')
const chatServer = net.createServer(), clientList = []
chatServer.on('connection', function (client) {
  client.write('Hi!\n');
  clientList.push(client)
  client.on('data', function (data) {
    clientList.forEach(v => {
      v.write(data)
    })
  })
})
chatServer.listen(9000)

/**
 * Net模块提供一个异步API能够创建基于流的TCP服务器，
 * 客户端与服务器建立连接后，服务器可以获得一个 全双工Socket对象，
 * 服务器可以保存Socket对象列表，在接收某客户端消息时，推送给其他客户端。
 * 
 * telnet localhost 9000
 * 多建立几个链接，就可以广播了
 * http://ww1.sinaimg.cn/large/0065fZzMgy1g8g7p2vvwtj30zq0kk0vo.jpg
 */