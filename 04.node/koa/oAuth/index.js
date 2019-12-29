const config = {
  client_id: "57cc54dd32bdf452f4db",
  client_secret: "bbd9cc01f136d63bce261a14defec7c5cafaa59b"
};
const axios = require('axios')
const querystring = require('querystring')

router.get("/login-github", async ctx => {
  //重定向到认证接口,并配置参数
  const path = `https://github.com/login/oauth/authorize?client_id=${config.client_id}`;
  //转发到授权服务器
  ctx.redirect(path);
});

router.get("/oauth/github/callback", async ctx => {
  const code = ctx.query.code;
  const params = {
    client_id: config.client_id,
    client_secret: config.client_secret,
    code: code
  };
  let res = await axios.post("https://github.com/login/oauth/access_token",params);
  console.log(res.data);
  const access_token = querystring.parse(res.data).access_token;
  res = await axios.get("https://api.github.com/user?access_token=" + access_token);
  console.log("userAccess:", res.data);
  ctx.redirect("/hello.html");
});