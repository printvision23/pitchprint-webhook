const express = require('express');
const axios = require('axios');
const ftp = require('basic-ftp');
const app = express();

// Middleware to parse incoming requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Webhook endpoint
app.post('/pitchprint-webhook', async (req, res) => {
  const { projectId, output } = req.body;

  if (!projectId || !output) {
    return res.status(400).send("Missing projectId or output URL");
  }

  try {
    // Step 1: Download the file from the output URL
    const response = await axios.get(output, { responseType: 'arraybuffer' });
    const fileBuffer = response.data;

    // Step 2: Connect to FTP server
    const client = new ftp.Client();
    client.ftp.verbose = true;  // Enables verbose logging for debugging

    await client.access({
      host: "ca82e33588.nxcli.net",     
      user: "a46190ab_1",               
      password: "EggnogDruidCappedXylem",
      secure: false
    });

    // Step 3: Upload the file
    const fileName = `design-${projectId}.zip`;  // Customize your file name
    await client.uploadFrom(fileBuffer, `/html/pub/media/pp_brochure_design/${fileName}`);

    console.log(`✅ Uploaded to FTP as ${fileName}`);
    
    // Send success response
    res.status(200).send("Design uploaded to FTP!");

    client.close();
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).send("Failed to upload design to FTP");
  }
});

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
