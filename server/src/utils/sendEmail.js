import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, url) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: `
        <main style="
          border: 1px solid #bfbfbf;
          border-radius: 9px;
          padding: 20px;
          width: fit-content;
          margin: auto;
        ">
          <h2>Please verify your email</h2>
          <p>To keep things secure and make sure your account is protected,<br> please verify your email using the button below.</p>
          <a href="${url}" style="
            font-weight: 700;
            display: inline-block;
            padding: 7px 15px;
            color: #ffffff;
            background-color: #3677e0;
            text-decoration: none;
            border-radius: 35px;
          ">
            Click to verify
          </a>
        </main>
      `, // html body
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email not sent", error);
  }
};
