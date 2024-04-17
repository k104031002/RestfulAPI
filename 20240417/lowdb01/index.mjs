import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { v4 as uuidv4 } from "uuid";

const defaultData = {
    user: {},
    products: []
};
const db = new Low(new JSONFile("db.json"), defaultData);
await db.read();

// 刪除
// db.data.products = db.data.products.filter(p => p.id !== "75f53fef-5b26-42a9-942c-98a3754a8378")


// await db.write();

// 更新
// db.data.products.find(p => p.id === "75f53fef-5b26-42a9-942c-98a3754a8378")
//     .stock = 59
// await db.write();

// 讀取
// let data = db.data.products.find(p => p.id === "46582a66-f4a3-4855-8bf4-1c1da8f7775d")
// let data = db.data.products.find(p => p.title === "damn糕");
// let data = db.data.products.filter(p => p.title.includes("damn"));

let page = 1;
let limit = 5;
let start = (page - 1) * limit;
let end = page * limit;
// let data = db.data.products.slice(start, end);
let data = db.data.products.sort((a, b) => b.price - a.price).slice(start, end);
console.log(data);

// console.log(db.data.user);


// 寫入

// db.data.products.push({
//     id: uuidv4(),
//     title: "damn糕",
//     price: 45,
//     stock: 100,
//     createTime:Date.now()
// });

// await db.write();

// db.data.products.unshift({
//     id: uuidv4(),
//     title: "后里蟹",
//     price: 1500,
//     stock: 1000,
//     createTime: Date.now()
// })
// await db.write();

// let uid = uuidv4();
// let user = {
//     id: uid,
//     account: "bro",
//     password: "a12345",
//     name: "bro蟹",
//     head: "http://randomuser.me/api/portraits/men/44.jpg"
// };
// db.data.user[uid] = user;
// await db.write();
