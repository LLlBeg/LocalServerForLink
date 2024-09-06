const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Статичні файли з папки public

async function checkSite(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let statusCode;
    try {
        const response = await page.goto(url, { waitUntil: 'networkidle2' });
        statusCode = response ? response.status() : null;
    } catch (error) {
        statusCode = 500; // Встановлюємо 500 у разі помилки
    } finally {
        await browser.close();
    }
    return statusCode;
}

app.post('/check', async (req, res) => {
    const { url } = req.body;
    const statusCode = await checkSite(url);
    res.json({ statusCode });
});

app.listen(3000, () => {
    console.log('Сервер запущено на http://localhost:3000');
});