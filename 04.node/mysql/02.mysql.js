const mysql = require("mysql"); // 连接配置
const cfg = {
  host: "localhost",
  user: "root",
  password: "password", 
  database: "test"
};
// 创建连接对象
const conn = mysql.createConnection(cfg);
// 连接 
conn.connect(err => {
  if (err) {
    throw err;
  } else { 
    console.log("连接成功!");
  } 
});


// 创建表
const CREATE_SQL = `CREATE TABLE IF NOT EXISTS test (
  id INT NOT NULL AUTO_INCREMENT,
  message VARCHAR(45) NULL,
  PRIMARY KEY (id))`;

const INSERT_SQL = `INSERT INTO test(message) VALUES(?)`;
const SELECT_SQL = `SELECT * FROM test`;

conn.query(CREATE_SQL, err => {
  if (err) {
    throw err;
  }
  // 插入数据
  conn.query(INSERT_SQL, "hello,world", (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
    conn.query(SELECT_SQL, (err, results) => {
        console.log(results);
        conn.end(); // 若query语句有嵌套，则end需在此执行 })
    }); 
  })
})

/**
 * async function main() {
    const mysql = require('mysql2/promise');
    // 创建连接
    const conn = await mysql.createConnection({host:'localhost', user: 'root', password:'root', database: 'test'});

    // 允许使用Promise第三方库，如下：
    // const bluebird = require('bluebird');
    // const conn = await mysql.createConnection({host:'localhost', user: 'root', database: 'test', Promise: bluebird});

    // 数据库操作
    const [rows, fields] = await conn.execute('SELECT * FROM `table` WHERE `name` = ? AND `age` > ?', ['Morty', 14]);
  }
 */