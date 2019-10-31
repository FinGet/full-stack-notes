// ORM 使用对象，封装了数据库操作，因此可以不碰 SQL 语言。
// 开发者只使用面向对象编程，与数据对象直接交互，不用关心底层数据库。

(async () => {
  const Sequelize = require("sequelize");
  // 建立连接
  const sequelize = new Sequelize("test", "root", "sxxsw", {
    host: "localhost",
    dialect: "mysql",
    operatorsAliases: false
  });

  // 定义模型
  const Fruit = sequelize.define("Fruit", {
    name: {
      type: Sequelize.STRING(20), allowNull: false,
      // 类似计算属性
      get() {
        const fname = this.getDataValue("name");
        const price = this.getDataValue("price");
        const stock = this.getDataValue("stock");
        return `${fname}(价格:¥${price} 库存:${stock}kg)`;
      }
    },
    price: {
      type: Sequelize.FLOAT, allowNull: false,
      // 数据校验
      validate: {
        isFloat: { msg: "价格字段请输入数字" },
        min: { args: [0], msg: "价格字段必须大于0" }
      }
    },
    stock: { type: Sequelize.INTEGER, defaultValue: 0 }
  }, {
    timestamps: false,// {timestamps: false} 避免自动生成时间戳
    getterMethods: {
      amount() {
        return this.getDataValue("stock") + "kg";
      }
    },
    setterMethods: {
      amount(val) {
        const idx = val.indexOf('kg');
        const v = val.slice(0, idx);
        this.setDataValue('stock', v);
      }
    }
  });
  


  // 添加类级别方法
  Fruit.classify = function (name) {
    const tropicFruits = ['香蕉', '芒果', '椰子']; // 热带水果
    return tropicFruits.includes(name) ? '热带水果' : '其他水果';
  };
  // 添加实例级别方法
  Fruit.prototype.totalPrice = function (count) {
    return (this.price * count).toFixed(2);
  };
  // 使用类方法
  ['香蕉', '草莓'].forEach(f => console.log(f + '是' + Fruit.classify(f)));
  // 使用实例方法 
  Fruit.findAll().then(fruits => {
    const [f1] = fruits;
    console.log(`买5kg${f1.name}需要¥${f1.totalPrice(5)}`);
  });


  // 同步
  let res = await Fruit.sync({ force: true });
  // 强制同步:创建表之前先删除已存在的表
  console.log(res)

  Fruit.create({
    name: '香蕉',
    price: 3.5
  })

  let fruits = await Fruit.findAll()
  console.log(fruits)

  // 通过模型实例触发setterMethods 
  Fruit.findAll().then(fruits => {
    console.log(JSON.stringify(fruits)); // 修改amount，触发setterMethods 
    fruits[0].amount = '150kg';
    fruits[0].save();
  });
})()

/*
数据查询
// 通过id查询 
Fruit.findById(1).then(fruit => {
// fruit是一个Fruit实例，若没有则为null
    console.log(fruit.get());
});
// 通过属性查询
Fruit.findOne({ where: { name: "香蕉" } }).then(fruit => {
// fruit是首个匹配项，若没有则为null
    console.log(fruit.get());
});
// 获取数据和总条数 
Fruit.findAndCountAll().then(result => {
    console.log(result.count);
    console.log(result.rows.length);
});
// 查询操作符
const Op = Sequelize.Op; Fruit.findAll({
    // where: { price: { [Op.lt]:4 }, stock: { [Op.gte]: 100 } }
    where: { price: { [Op.lt]:4,[Op.gt]:2 }}
}).then(fruits => {
    console.log(fruits.length);
});
// 或语句 
Fruit.findAll({
    // where: { [Op.or]:[{price: { [Op.lt]:4 }}, {stock: { [Op.gte]: 100 }}] }
    where: { price: { [Op.or]:[{[Op.gt]:3 }, {[Op.lt]:2 }]}}
}).then(fruits => {
    console.log(fruits[0].get());
});
// 分页 
Fruit.findAll({
offset: 0,
limit: 2, })
// 排序 
Fruit.findAll({
    order: [['price', 'DESC']],
})
// 聚合 
setTimeout(() => {
  Fruit.max("price").then(max => n
    console.log("max", max);
  });
  Fruit.sum("price").then(sum => {
    console.log("sum", sum);
  });
}, 500);


// 更新
// 方式1
Fruit.findById(1).then(fruit => { 
    fruit.price = 4;
    fruit.save().then(()=>console.log('update!!!!'));
});
// 方式2
Fruit.update({price:4}, {where:{id:1}}).then(r => {
    console.log(r);
    console.log('update!!!!')
})


// 删除
// 方式1
Fruit.findOne({ where: { id: 1 } }).then(r => r.destroy());
// 方式2
Fruit.destroy({ where: { id: 1 } }).then(r => console.log(r));
*/

// https://www.processon.com/view/link/5cc0718ae4b01941c8bab3f8#map