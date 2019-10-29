const fs = require('fs')
const {promisify} = require('util')
// 同步
const data = fs.readFileSync('./wen.txt')

console.log(data)
console.log(data.toString())

// 异步
fs.readFile('./wen.txt', (err, data) => {
  console.log('-----------------')
  console.log(data.toString())
})

// promise
const readFile = promisify(fs.readFile)

readFile('./wen.txt').then(data => {
  console.log('-----------------')
  console.log(data.toString())
})