import express from 'express';
import multer from 'multer';
import cors from "cors";
import moment from 'moment';
import dotenv from 'dotenv';
import jwt, { decode } from 'jsonwebtoken';
import users from './users.mjs';

dotenv.config();
const secretKey = process.env.SECRET_KEY;
const upload = multer();
const whiteList = ["http://localhost:8080", "http://127.0.0.1:8080"];
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
});
app.get("/api/users/logout", checkToken, (req, res) => {
    // console.log(req.decode);
    const user = users.find(u => u.account === req.decode.account);
    if (user) {
        const token = jwt.sign({
            account: undefined,
            name: undefined,
            mail: undefined,
            head: undefined
        }, secretKey, { expiresIn: "-10s" })
        res.status(200).json({
            status: "success",
            token
        });
    } else {
        res.status(401).json({
            status: "error",
            message: "檢查狀態失敗，請重新登入"
        })
    }
});
app.post("/api/users/status", checkToken, (req, res) => {
    const user = users.find(u => u.account === req.decode.account);
    if (user) {
        const token = jwt.sign({
            account: undefined,
            name: undefined,
            mail: undefined,
            head: undefined
        }, secretKey, { expiresIn: "30m" })
        res.status(200).json({
            status: "success",
            token
        });
    } else {
        res.status(401).json({
            status: "error",
            message: "登出失敗，請稍後再次嘗試"
        })
    }
});


app.listen(3000, () => {
    console.log("server is running http://localhost:3000");
})

function checkToken(req, res, next) {
    let token = req.get("authorization");
    if (token && token.indexOf("Bearer ") === 0) {
        token = token.slice(7);
        jwt.verify(token, secretKey, (error, decode) => {
            if (error) {
                return res.status(401).json({
                    status: "error",
                    message: "驗證失敗，請重新再來"
                })
            }
            req.decode = decode;
            next();
        });
    } else {
        res.status(400).json({
            status: "error",
            message: "沒有驗證資料，請重新登入"
        })
    }
}