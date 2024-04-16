import express from 'express';
import multer from 'multer';
import cors from "cors";
import moment from 'moment';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import users from './users.mjs';

dotenv.config();
const secretKey = process.env.SECRET_KEY;
const upload = multer();
const whiteList = ["http://localhost:5500", "http://127.0.0.1:5500"];
const corsOptions = {
    credentials: true,
    origin(origin, callback) {
        if (!origin || whiteList.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("不允許傳遞資料"))
        }
    }
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("首頁");
});

app.post("/api/users/login", upload.none(), (req, res) => {
    const { account, password } = req.body;
    const user = users.find(u => u.account === account && u.password === password
    );
    if (user) {
        const token = jwt.sign({
            account: user.account,
            name: user.name,
            mail: user.mail,
            head: user.head
        }, secretKey, { expiresIn: "30m" })
        res.status(200).json({
            status: "success",
            token
        })
    } else {
        res.status(400).json({
            status: "error",
            message: "使用者驗證失敗"
        });
    }
    res.status(200).json({ message: "登入成功" });
});
app.get("/api/users/logout", (req, res) => {
    res.status(200).json({ message: "登出成功" });
});
app.post("/api/users/status", (req, res) => {
    res.status(200).json({ message: "檢查登入或登出的狀態" });
});


app.listen(3000, () => {
    console.log("server is running http://localhost:3000");
})
