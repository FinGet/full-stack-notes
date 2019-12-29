const jsonwebtoken = require('jsonwebtoken');
const secret = '123456'
const opt = {
  sercret: 'jwt_secret',
  key: 'user'
}
const user = {
  username:'abc',
  password:'123231'
}

const token = jsonwebtoken.sign({
  data: user,
  exp: Math.floor(Date.now() / 1000) + (60*60)
}, secret)

console.log('token:' + token);
// token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoiYWJjIiwicGFzc3dvcmQiOiIxMjMyMzEifSwiZXhwIjoxNTc3NTk2NDMyLCJpYXQiOjE1Nzc1OTI4MzJ9.jcOfkA0y-N9npAwxYSuI1AP0tgij5yonaWo4GYTHHPE
console.log('解码:', jsonwebtoken.verify(token, secret, opt));