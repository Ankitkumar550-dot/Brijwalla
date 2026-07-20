import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

console.log("EMAIL =", process.env.EMAIL);
console.log("PASS =", process.env.PASS ? "FOUND" : "MISSING");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendOtpMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset OTP</h2>
          <p>Your OTP for password reset is:</p>
          <h1 style="color: #2563eb;">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });

    console.log("OTP email sent successfully");
  } catch (error) {
    console.log("Mail Error:", error);
    throw error;
  }
};