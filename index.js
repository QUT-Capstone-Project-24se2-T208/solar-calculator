const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = 5000;

// multer: in-memory file storage
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.post("/send-quote", upload.array("files"), async (req, res) => {
  const { name, email, phone, website, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: process.env.RECEIVER_EMAIL,
    subject: `New Quote Request from ${name}`,
    html: `
      <h3>New Quote Request</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Website:</strong> ${website}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
    attachments: req.files.map(file => ({
      filename: file.originalname,
      content: file.buffer,
    })),
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).send("Failed to send email");
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
