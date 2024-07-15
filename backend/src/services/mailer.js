import nodemailer from 'nodemailer';

var transport = nodemailer.createTransport({
     host: "sandbox.smtp.mailtrap.io",
     port: 2525,
     auth: {
          user: "ece6fe9eae57b5",
          pass: "39649760b7d37c",
     },
});

// Send Email
export const sendEmail = async (to, subject, text) => {
     const mailOptions = {
          from: "durgeshbachhav123@gmail.com",
          to,
          subject,
          text
     };

     try {
          await transport.sendMail(mailOptions);
          console.log('Email sent successfully');
     } catch (error) {
          console.error('Error sending email:', error);
     }
};
