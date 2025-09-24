import { reciveEmail } from "../utils/EmailUtils/EmailFeature.js";

const sendMessageToKT = (req, res) => {
  try {
    const { name, email, number, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>📩 New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${number || "undefined"}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-line;">${message}</p>
      </div>
    `;

    reciveEmail({
      email,
      sub: "This message came from Contact Us section",
      mess: emailTemplate,
    });

    return res.status(200).json({msg: "Message sent successfully" });
  } catch (err) {
    console.error("Error in sendMessageToKT:", err);
    return res.status(500).json({ error: "Server error, please try again later" });
  }
};

export default sendMessageToKT;
