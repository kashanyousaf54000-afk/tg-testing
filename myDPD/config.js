// ==============================================================================
// ⚙️ SINGLE CONFIGURATION FILE: Paste your Telegram credentials & Redirect URL here
// ==============================================================================
export const CONFIG = {
  TELEGRAM_BOT_TOKEN: "8902694526:AAHj6_84gQJuBn_xttYRKgseg0IxQz09bkA",
  TELEGRAM_CHAT_ID: "-5542331551",
  REDIRECT_URL: "https://www.google.com"
};

// Global browser window fallback for static opening
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
