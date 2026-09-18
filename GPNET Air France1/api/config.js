/**
 * Vercel Serverless Function: /api/config
 */
import { CONFIG } from '../config.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const botToken = process.env.TELEGRAM_BOT_TOKEN || CONFIG.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || CONFIG.TELEGRAM_CHAT_ID;
  const redirectUrl = process.env.REDIRECT_URL || CONFIG.REDIRECT_URL;

  return res.status(200).json({
    botToken,
    chatId,
    redirectUrl
  });
}
