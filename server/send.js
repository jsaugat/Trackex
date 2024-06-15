import nodemailer from "nodemailer";

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'joshsaugat58@gmail.com',  // replace with your email
        pass: 'qfdo yvyr zkvb rwoo',   // replace with your email password or app-specific password
    },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'joshsaugat58@gmail.com', // sender address
    to: 'jsaugatt02@gmail.com', // list of receivers
    subject: 'TRACKEX Authentication', // Subject line
    html: `
      <main style="
        border: 1px solid #bfbfbf;
        border-radius: 9px;
        padding: 20px;
        width: fit-content;
        margin: auto;
        "
      >
        <h2>Please verify your email</h2>
        <p>To keep things secure and make sure your account is protected,<br> please verify your email using the button below.</p>
        <a href="http://example.com/verify" style="
          font-weight: 700;
          display: inline-block;
          padding: 7px 15px;
          color: #ffffff;
          background-color: #3677e0;
          text-decoration: none;
          border-radius: 35px;
          "
        >
          Click to verify
        </a>
      </main>
    `, // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);
