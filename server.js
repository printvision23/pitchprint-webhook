const express = require('express');
const axios = require('axios');
const fs = require('fs');
const ftp = require('basic-ftp');
const app = express();

app.use(express.json());

app.post('/pitchprint-webhook', async (req, res) => {
    const { projectId, output } = req.body;

    if (!output) return res.status(400).send('Missing output URL');

    const fileName = `design-${projectId}.zip`;

    try {
        const response = await axios.get(output, { responseType: 'arraybuffer' });
        fs.writeFileSync(fileName, response.data);

        const client = new ftp.Client();
        await client.access({
            host: "ca82e33588.nxcli.net",     // <-- Replace with your FTP host
            user: "a46190ab_1",                // <-- Replace with your FTP username
            password: "EggnogDruidCappedXylem",        // <-- Replace with your FTP password
            secure: false
        });

     //-->   await client.uploadFrom(fileName, `/uploads/${fileName}`);  // <-- Replace with your folder
        await client.uploadFrom(fileName, "html/pub/media/pp_brochure_design/" + fileName);

        client.close();

        res.send('Uploaded to FTP');
    } catch (err) {
        console.error(err);
        res.status(500).send('Upload failed');
    }
});

app.listen(3000, () => console.log('Listening on port 3000'));
