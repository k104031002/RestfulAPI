import express from "express";
import multer from "multer";
import moment from "moment";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import dotenv from "dotenv";
import router from "./product.mjs";

dotenv.config();
const secretKey = process.env.SECRET_KEY;


let whitelist = ["http://localhost:5500", "http://localhost:3000"];
let corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('不允許傳遞資料 CORS'))
        }
    }
}
const upload = multer();
const defaultData = { products: [], user: [] };
const db = new Low(new JSONFile('db.json'), defaultData);
await db.read();

console.log(db.data);

const app = express();
app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/", router)

app.get("/", (req, res) => {
    res.send("首頁");
});

app.get("/api/users", async (req, res) => {
    // res.send("獲取所有使用者");
    // getUserAll
    let user, error;
    user = await getUserAll().then(result => result).catch(err => {
        error = err;
        console.log(err);
        return undefined;
    });
    if (error) {
        res
            .status(401)
            .json({ status: "error", message: "Unauthorized access" });
        return false
    }
    if (user) {
        res.status(200).json({
            status: "success",
            user
        })
    }
})

app.get("/api/users/search", (req, res) => {
    res.send("使用 ID 作為搜尋條件來搜尋使用者");
});

app.get("/api/users/status", (req, res) => {
    res.send("檢查使用者登入登出狀態");
});

app.get("/api/users/:id/", async (req, res) => {
    // res.send(`獲取特定 ID 的使用者 ${req.params.id}`);
    // getUser
    let user, error;
    user = await getUser(req).then(result => result).catch(err => {
        error = err;
        console.log(err);
        return undefined;
    });
    if (error) {
        let message = (error.message) ? error.message : "user not found";
        res
            .status(404)
            .json({ status: "error", message });
        return false
    }
    if (user) {
        let { password, ...newUser } = user;
        res.status(200).json({
            status: "success",
            user: newUser
        })
    }
});

app.post("/api/users/", (req, res) => {
    // res.send("新增一個使用者");

});

app.put("/api/users/:id/", (req, res) => {
    res.send(`更新特定 ID 的使用者 ${req.params.id}`);
});

app.delete("/api/users/:id/", (req, res) => {
    res.send(`刪除特定 ID 的使用者 ${req.params.id}`);
});

app.post("/api/users/login", (req, res) => {
    res.send("使用者登入");
});

app.post("/api/users/logout", (req, res) => {
    res.send("使用者登出");
});







app.listen(3000, () => {
    console.log("server is running at http://localhost:3000 蟹");
});

async function addUser(req) {
    const { account, password, name, email, head } = req.body;

    let id = uuidv4();
    db.data.user.push({
        id,
        account,
        password,
        name,
        email,
        head
    });
    await db.write();
    return new Promise((resolve, reject) => {
        resolve(id);
    });
}

function getUser(req) {
    let id = req.params.id;
    return new Promise((resolve, reject) => {
        let result = db.data.user.find(u => u.id === id);
        if (result) {
            resolve(result);
        } else {
            reject(new Error("user not found"));
        }
    });
}

function getUserAll() {
    return new Promise(resolve => {
        resolve(db.data.user)
    });
}

function checkToken(req, res, next) {
    let token = req.get("Authorization");

    if (token && token.indexOf("Bearer ") === 0) {
        token = token.slice(7);
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res
                    .status(401)
                    .json({ status: "error", message: "登入驗證失效，請重新登入。" });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res
            .status(401)
            .json({ status: "error", message: "無登入驗證資料，請重新登入。" });
    }
}