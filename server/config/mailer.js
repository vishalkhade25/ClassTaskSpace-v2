import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
});

const sendEmail = async (to, subject, text) => {
    const result = await brevo.transactionalEmails.sendTransacEmail({
        subject: subject,
        textContent: text,
        sender: {
            name: "ClassTaskSpace",
            email: process.env.BREVO_SENDER_EMAIL
        },
        to: [
            {
                email: to
            }
        ]
    });

    console.log("Email sent successfully:", result);
};

export default sendEmail;