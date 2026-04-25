import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export class NodeMailerService {
  async sendEmail(userEmail: string, confirmationCode: string) {
    // REAL ACCOUNT
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.gmail.com",
    //   auth: {
    //     user: "mrsevere484@gmail.com",
    //     pass: process.env.GOOGLE_APP_PASSWORD,
    //   },
    // });

    // MOCK ETHEREAL ACCOUNT
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // Use true for port 465, false for port 587
      auth: {
        user: "rhett88@ethereal.email",
        pass: "RagH4VnZeBxkEP5een",
      },
    });

    try {
      await transporter.verify();
      console.log("Server is ready to take our messages");
    } catch (e) {
      console.error("Verification failed", e);
    }

    // REAL ACCOUNT
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const info = await transporter.sendMail({
    //   from: 'mrsevere484@gmail.com',
    //   to: userEmail,
    //   subject: "Registration",
    //   text: "Welcome", // Plain-text version of the message
    //   html: `<h1>Thank for your registration</h1><p>To finish registration please follow the link below:<a href='http://localhost:5003/auth/registration-confirmation?code=${confirmationCode}'>complete registration</a></p>`,
    // });

    // MOCK ETHEREAL ACCOUNT
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const info = await transporter.sendMail({
      from: 'rhett88@ethereal.email',
      to: userEmail,
      subject: "Registration",
      text: "Welcome", // Plain-text version of the message
      html: `<h1>Thank for your registration</h1><p>To finish registration please follow the link below:<a href='http://localhost:5003/auth/registration-confirmation?code=${confirmationCode}'>complete registration</a></p>`,
    });

    console.log("QUERY: ", confirmationCode);
  }

  async sendRecoveryCode(userEmail: string, recoveryCode: string) {
       
    // REAL ACCOUNT
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.gmail.com",
    //   auth: {
    //     user: "mrsevere484@gmail.com",
    //     pass: process.env.GOOGLE_APP_PASSWORD,
    //   },
    // });

    // MOCK ETHEREAL ACCOUNT  
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // Use true for port 465, false for port 587
      auth: {
        user: "rhett88@ethereal.email",
        pass: "RagH4VnZeBxkEP5een",
      },
    });

    try {
      await transporter.verify();
      console.log("Server is ready to take our messages");
    } catch (e) {
      console.error("Verification failed", e);
    }

    // REAL ACCOUNT
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const info = await transporter.sendMail({
    //   from: 'mrsevere484@gmail.com',
    //   to: userEmail,
    //   subject: "Registration",
    //   text: "Welcome", // Plain-text version of the message
    //   html: `<h1>Password recovery</h1><p>To finish password recovery please follow the link below:<a href='http://localhost:5003/auth/registration-confirmation?code=${recoveryCode}'>recovery password</a></p>`,
    // });

    // MOCK ETHEREAL ACCOUNT
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const info = await transporter.sendMail({
      from: 'rhett88@ethereal.email',
      to: userEmail,
      subject: "Registration",
      text: "Welcome", // Plain-text version of the message
      html: `<h1>Password recovery</h1><p>To finish password recovery please follow the link below:<a href='http://localhost:5003/auth/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a></p>`,
    });

    console.log("recoveryCode: ", recoveryCode);
  }
};
