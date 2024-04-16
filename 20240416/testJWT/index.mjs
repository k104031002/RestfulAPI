import jwt from 'jsonwebtoken';
const secretKey = "bonbonbon";

const token = jwt.sign(
    {
        userID: "bonbon",
        name: "Bon Lei",
        email: "bonlei@gmail.com"
    }, secretKey);

console.log(token);
