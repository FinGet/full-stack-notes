## CSR(client side render) & SSR(server side render)

- 传统web

![](http://pz1uhohzm.bkt.clouddn.com/9AF02DB0-C439-4938-8B1F-8CF0F4FD41CD.png)

- Spa

![](http://pz1uhohzm.bkt.clouddn.com/DCFD9CAE-B230-48A4-9528-0BA2A0F7DC6E.png)

1. 首屏渲染性能。必须等js加载完毕，并且执行完毕，才能渲染出首屏
2. seo。爬虫只能拿到一个div，认为页面是空的，不利于seo


- SSR
为了解决这两个问题，出现了SSR解决方案，后端渲染出完整的首屏的dom结构返回，前端拿到的内容带上首屏，后续的页面操作，再用单页的路由跳转渲染，称为服务端渲染（server side render）
![](http://pz1uhohzm.bkt.clouddn.com/FF55807B-8BCE-4A89-9038-A81458728211.png)

## Nuxt

之前做过一个Nuxt+koa的全栈商城，这里就不单独介绍Nuxt里。

点这里[Koa+Nuxt商城](https://github.com/FinGet/koa-nuxt-mall)