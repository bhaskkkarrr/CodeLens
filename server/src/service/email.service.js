import nodemailer from "nodemailer";
import config from "../config/config.js";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.GOOGLE_USER,
    pass: config.GOOGLE_APP_PASSWORD,
  },
});
console.log(config.GOOGLE_USER);
console.log(config.GOOGLE_APP_PASSWORD);
transporter.verify((error, success) => {
  if (error) {
    console.error("Email connection error:", error);
    return;
  }

  console.log("Email service connection established successfully");
});

export const sendMail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${config.GOOGLE_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });
    console.log("Sent email", info);
    return {
      success: true,
      message: "Email sent",
      info: info.response,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
