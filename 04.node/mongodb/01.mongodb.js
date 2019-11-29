// 客户端
const MongoClient = require("mongodb").MongoClient;

// 连接URL
const url = "mongodb://localhost:27017";

// 数据库名
const dbName = 'test';

(async function() {
	// 创建客户端
	const client = new MongoClient(url, {useNewUrlParser: true});

	try {
		await client.connect();
		console.log('连接成功');
	} catch(error){
		console.log(error);
	}

	// 2.获取数据库
	const db = client.db(dbName);
	// 3.获取集合
	const fruitsColl = db.collection("fruits");
	// 4.插入文档(异步)
	let r;
	r = await fruitsColl.insertOne({ name: "芒果", price: 20.0 }); 
	console.log("插入成功", r.result);

	// 5.更新文档
	r = await fruitsColl.updateone({name: '芒果1'},{$set:{price: 19.8}});
	console.log("更新成功", r.result);

	// 6.查询文档
	r = await fruitsColl.find().toArray();
	console.log('查询结果',r);

	// 7.删除文档
	// r = await fruitsColl.deleteOne({name: '芒果1'});
	r = await fruitsColl.deleteMany({price: 20});
	console.log('删除成功', r.result);

	// 关闭连接
	client.close();
})()