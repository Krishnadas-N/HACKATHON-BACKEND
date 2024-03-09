const { Vonage } = require('@vonage/server-sdk');
const fs = require('fs');
require('dotenv').config()
const vonage = new Vonage({
  applicationId: process.env.VONAGE_APPLICATION_ID,
  privateKey: process.env.VONAGE_APPLICATION_PRIVATE_KEY_PATH
});

const Vonages = new Vonage({
    apiKey: process.env.Vonage_API_KEY,
    apiSecret: process.env.Vonage_API_SECRET
  })


function h() {
    console.log(vonage.privateKey);
    // Read the file
    fs.readFile(process.env.VONAGE_APPLICATION_PRIVATE_KEY_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        // File content is available in the data variable
        console.log('File content:', data);
    });
}

module.exports={
    vonage,
    Vonages
}