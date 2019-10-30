## Node.js的特点
- 单线程 （single thread）

 在Java、PHP或者.net等服务器端语言中，会为每一个客户端连接创建一个新的线程。而每个线程需要耗费大约2MB内存。也就是说，理论上，一个8GB内存的服务器可以同时连接的最大用户数为4000个左右。要让Web应用程序支持更多的用户，就需要增加服务器的数量，而Web应用程序的硬件成本当然就上升了。
 Node.js不为每个客户连接创建一个新的线程，而仅仅使用一个线程。当有用户连接了，就触发一个内部事件，通过非阻塞I/O、事件驱动机制，让Node.js程序宏观上也是并行的。使用Node.js，一个8GB内存的服务器，可以同时处理超过4万用户的连接。
 另外，单线程的带来的好处，还有操作系统完全不再有线程创建、销毁的时间开销。
 坏处，就是一个用户造成了线程的崩溃，整个服务都崩溃了，其他人也崩溃了。

- 非阻塞I/O （Non-blocking I/O）

 例如，当在访问数据库取得数据的时候，需要一段时间。在传统的单线程处理机制中，在执行了访问数据库代码之后，整个线程都将暂停下来，等待数据库返回结果，才能执行后面的代码。也就是说，I/O阻塞了代码的执行，极大地降低了程序的执行效率。
 由于Node.js中采用了非阻塞型I/O机制，因此在执行了访问数据库的代码之后，将立即转而执行其后面的代码，把数据库返回结果的处理代码放在回调函数中，从而提高了程序的执行效率。
 当某个I/O执行完毕时，将以事件的形式通知执行I/O操作的线程，线程执行这个事件的回调函数。为了处理异步I/O，线程必须有事件循环，不断的检查有没有未处理的事件，依次予以处理。
 阻塞模式下，一个线程只能处理一项任务，要想提高吞吐量必须通过多线程。而非阻塞模式下，一个线程永远在执行计算操作，这个线程的CPU核心利用率永远是100%。所以，这是一种特别有哲理的解决方案：与其人多，但是好多人闲着；还不如一个人玩命，往死里干活儿。

- 事件驱动 (Event Driven)

 在Node中，客户端请求建立连接，提交数据等行为，会触发相应的事件。在Node中，在一个时刻，只能执行一个事件回调函数，但是在执行一个事件回调函数的中途，可以转而处理其他事件（比如，又有新用户连接了），然后返回继续执行原事件的回调函数，这种处理机制，称为“事件环”机制。
 Node.js底层是C++（V8也是C++写的）。底层代码中，近半数都用于事件队列、回调函数队列的构建。用事件驱动来完成服务器的任务调度，这是鬼才才能想到的。针尖上的舞蹈，用一个线程，担负起了处理非常多的任务的使命。

> CPU密集： 压缩、解压、加密、解密 I/O密集： 文件操作、网络操作、数据库


##  response.setHeader和response.writeHead之间的区别

`response.setHeader()`只允许您设置单个头.

```javascript
var body = "hello world";
response.setHeader("Content-Length", body.length);
response.setHeader("Content-Type", "text/plain");
response.setHeader("Set-Cookie", "type=ninja");
response.status(200);
```

`response.writeHead()`将允许您设置几乎关于响应头的所有内容,包括状态代码,内容和多个标题.

```javascript
var body = "hello world";
response.writeHead(200, {
    "Content-Length": body.length,
    "Content-Type": "text/plain",
    "Set-Cookie": "type=ninja"
});
```

## HTTP协议

[前端工程师，揭开HTTP的神秘面纱](https://finget.github.io/2018/07/03/http/)

### 实现一个及时聊天工具

- scoket实现

Net模块提供一个异步API能够创建基于流的TCP服务器，
客户端与服务器建立连接后，服务器可以获得一个 全双工Socket对象，
服务器可以保存Socket对象列表，在接收某客户端消息时，推送给其他客户端。

```javascript
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
```

> telnet localhost 9000
多建立几个链接，就可以广播了

![](http://ww1.sinaimg.cn/large/0065fZzMgy1g8g7p2vvwtj30zq0kk0vo.jpg)

- Socket.IO实现

```javascript
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    console.log('io connection ..')
    socket.on('chat', (msg) => {
    });
});
app.post('/send', (req, res) => {
    list.push(req.body.message) // // SocketIO 增加
        io.emit('chat', list)
        res.end(JSON.stringify(list))
})
```

```javascript
const socket = io(host) 
socket.on('chat', list => {
    this.list = list
});
```

[这里有一个demo可以瞧一瞧](https://github.com/FinGet/socket_demo)


### 跨域

[各种跨域解决方案](https://github.com/FinGet/learn_notes/tree/master/%E5%90%84%E7%A7%8D%E8%B7%A8%E5%9F%9F%E6%96%B9%E6%A1%88)

### 正向代理和反向代理

正向代理是一个位于客户端和目标服务器之间的代理服务器(中间服务器)。为了从原始服务器取得内容，客户端向代理服务器发送一个请求，并且指定目标服务器，之后代理向目标服务器转交并且将获得的内容返回给客户端。正向代理的情况下客户端必须要进行一些特别的设置才能使用。

反向代理正好相反。对于客户端来说，反向代理就好像目标服务器。并且客户端不需要进行任何设置。客户端向反向代理发送请求，接着反向代理判断请求走向何处，并将请求转交给客户端，使得这些内容就好似他自己一样，因此客户端并不会感知到反向代理后面的服务，也因此不需要客户端做任何设置，只需要把反向代理服务器当成真正的服务器就好了。


[正向代理和反向代理的区别](https://www.tuicool.com/articles/M7bAnqy)