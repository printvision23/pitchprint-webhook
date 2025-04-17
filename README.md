# PitchPrint Webhook to FTP Uploader

## 🚀 Setup Instructions

1. **Edit FTP credentials in `server.js`**
   Replace the placeholder values:
   - `host: "your.ftpserver.com"`
   - `user: "ftpuser"`
   - `password: "ftppassword"`
   - Upload path `/uploads/${fileName}`

2. **Deploy to Render**
   - Go to [https://render.com](https://render.com)
   - Click **New > Web Service**
   - Connect this repo or upload manually
   - Choose `start` as the build command

3. **Add the Webhook to PitchPrint**
   - Go to PitchPrint Admin > Settings > Webhooks
   - Add: `https://yourapp.onrender.com/pitchprint-webhook`
   - Save

## ✅ Test it out!
When a design is saved or an order is completed, the file will upload to your FTP server.
