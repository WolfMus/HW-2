import nodemailer from "nodemailer";

export const nodeMailerService = {
  async sendEmail(userEmail: string, confirmationCode: string) {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // Use true for port 465, false for port 587
      auth: {
        user: "rhett88@ethereal.email",
        pass: "RagH4VnZeBxkEP5een",
      },
    });

    const info = await transporter.sendMail({
      from: 'rhett88@ethereal.email',
      to: userEmail,
      subject: "Registration",
      text: "Welcome", // Plain-text version of the message
      html: `<h1>Thank for your registration</h1><p>To finish registration please follow the link below:<a href='http://localhost:5003/auth/registration-confirmation?code=${confirmationCode}'>complete registration</a></p>`,
    });

    console.log("QUERY: ", confirmationCode);
  },
};
