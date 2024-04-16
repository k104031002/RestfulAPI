import jwt from 'jsonwebtoken';
// const secretKey = "bonbonbon"
// const secretKey = process.argv[2];
// import { secretKey } from './config.mjs';
import dotenv from 'dotenv';
dotenv.config();
const secretKey = process.env.SECERY_KEY;

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJib25ib24iLCJuYW1lIjoiQm9uIExlaSIsImVtYWlsIjoiYm9ubGVpQGdtYWlsLmNvbSIsImlhdCI6MTcxMzIzMDg4OH0.edibz9j_B-ICBLNkrCtQTQk4mIuYE_aMxW9YFYThVWw"

jwt.verify(token, secretKey, (error, data) => {
    if (error) {
        console.log("驗證失敗")
        return false
    }
    console.log("驗證成功");
    console.log(data);

});