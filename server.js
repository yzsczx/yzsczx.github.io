const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 读取文章数据
app.get('/api/articles', (req, res) => {
    fs.readFile('allArticles.txt', 'utf8', (err, data) => {
        if (err) return res.status(500).send('读取文件失败');
        res.json(JSON.parse(data || '[]'));
    });
});

// 保存文章数据
app.post('/api/articles', (req, res) => {
    const articles = req.body;
    fs.writeFile('allArticles.txt', JSON.stringify(articles), (err) => {
        if (err) return res.status(500).send('保存失败');
        res.send('保存成功');
    });
});

app.listen(PORT, () => {
    console.log(`服务运行在 http://localhost:${PORT}`);
});