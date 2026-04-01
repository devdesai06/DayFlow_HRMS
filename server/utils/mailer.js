import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

export const sendOTP = async (email, otp) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = {
      sender: {
        email: process.env.SENDER_EMAIL,
        name: "DayFlow",
      },
      to: [{ email }],
      subject: "Login OTP",
      textContent: `Your OTP is ${otp}`,
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email sent:", data);
  } catch (error) {
    console.error("MAIL ERROR:", error);
  }
};