const express = require('express');
const fs = require('fs');
const axios = require('axios');
const ftp = require('basic-ftp');
const app = express();

app.use(express.json());

app.post('/pitchprint-webhook', async (req, res) => {
    console.log("📩 Webhook received!");

    const { projectId, output } = req.body;
    console.log("📦 Project ID:", projectId);
    console.log("🔗 Output URL:", output);

    if (!output) {
        console.log("⚠️ No output URL in request");
        return res.status(400).send('Missing output URL');
    }

    const fileName = `design-${projectId}.zip`;

    try {
        console.log("⬇️ Downloading design...");
        const response = await axios.get(output, { responseType: 'arraybuffer' });
        fs.writeFileSync(fileName, response.data);
        console.log("✅ File downloaded locally");

        const client = new ftp.Client();
        await client.access({
              host: "ca82e33588.nxcli.net",     // <-- Replace with your FTP host
            user: "a46190ab_1",                // <-- Replace with your FTP username
            password: "EggnogDruidCappedXylem",        // <-- Replace with your FTP password
            secure: false
        });

        console.log("📤 Uploading to FTP...");
        await client.uploadFrom(fileName, "html/pub/media/pp_brochure_design/" + fileName);
        console.log("✅ Uploaded to FTP successfully!");

        client.close();
        res.send('Uploaded to FTP');
    } catch (err) {
        console.error("❌ Upload failed:", err);
        res.status(500).send('Upload failed');
    }
});

// PORT FIX for Render.com
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
