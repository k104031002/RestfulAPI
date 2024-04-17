import express from "express";
const router = express.Router();



router.get("/api/products/", (req, res) => {
    res.send("得到所有產品");
});

router.get("/api/products/search?id=X", (req, res) => {
    res.send("用ID 做搜尋條件搜尋產品");
});

router.get("/api/products/:id", (req, res) => {
    res.send(`得到產品ID為X的檔案 ${req.params.id}`);
});

router.post("/api/products/", (req, res) => {
    res.send("新增一個產品");
});

router.put("/api/products/:id", (req, res) => {
    res.send(`更新 ID 為 X 的產品 ${req.params.id}`);
});

router.delete("/api/products/:id", (req, res) => {
    res.send(`刪除 ID 為 X 的產品 ${req.params.id}`);
});

export default router

