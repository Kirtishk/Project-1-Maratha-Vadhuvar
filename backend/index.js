import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const corsOrigin = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "1mb" }));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "ok" });
});

app.post("/api/send-email", async (req, res) => {
  const { to, subject, html } = req.body || {};

  if (!to || !subject || !html) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    await transporter.sendMail({
      from: `"Maratha Vaduvar" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    return res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
  });
}

export default app;
