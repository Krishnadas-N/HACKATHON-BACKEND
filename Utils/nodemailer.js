const nodemailer = require('nodemailer');
require('dotenv').config()
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD 
  }
});

const sendEmail = async (email, subject, message) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email, 
      subject: subject,
      html: `
      <html>
        <head>
          <style>
            /* Add your CSS styles here */
            body {
              font-family: Arial, sans-serif;
              background-color: #f2f2f2;
              padding: 20px;
            }
            .container {
              background-color: #fff;
              border-radius: 5px;
              padding: 20px;
            }
            .header {
              background-color: #007bff;
              color: #fff;
              padding: 10px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              padding: 20px;
            }
            .footer {
              background-color: #007bff;
              color: #fff;
              padding: 10px;
              text-align: center;
              border-radius: 0 0 5px 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Survivor Support</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for reaching out to us. We have received your report and will take appropriate action.</p>
              <p>Report ID: ${message}</p>
              <p>Stay strong!</p>
            </div>
            <div class="footer">
              <p>Best regards,<br>Survivor Support Team</p>
            </div>
          </div>
        </body>
      </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; 
  }
};

module.exports = { sendEmail };
