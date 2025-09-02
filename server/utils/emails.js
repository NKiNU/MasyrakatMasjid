// const nodemailer = require('nodemailer');
// const dotenv = require('dotenv');

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   // debug: true, // Enable debug logs
//   // logger: true,
// });

// const sendEmail = async (email, verificationToken) => {
//   try {
//     const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

//     const mailOptions = {
//       from: `"Masyarakat Masjid"`,
//       to: email,
//       subject: 'Verify Your Email Address',
//       html: `
//         <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
//           <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
//             <h1 style="color: #1a365d;">Email Verification</h1>
//           </div>
//           <div style="padding: 20px;">
//             <p>Thank you for registering with Masyarakat Masjid. Please verify your email address by clicking the button below:</p>
            
//             <div style="text-align: center; margin: 30px 0;">
//               <a href="${verificationLink}" 
//                  style="background-color: #4a90e2; 
//                         color: white; 
//                         padding: 12px 30px; 
//                         text-decoration: none; 
//                         border-radius: 5px; 
//                         display: inline-block;">
//                 Verify Email
//               </a>
//             </div>
            
//             <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
//             <p style="word-break: break-all; color: #4a90e2;">${verificationLink}</p>
            
//             <p style="margin-top: 30px; color: #666;">
//               If you didn't create an account with Masyarakat Masjid, please ignore this email.
//             </p>
//           </div>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully to:', email);
//   } catch (error) {
//     console.error('Failed to send email:', error);
//     throw new Error('Unable to send verification email');
//   }
// };

// const sendTemporaryPassword = async (email, temporaryPassword) => {
//   try {
//     const mailOptions = {
//       from: '"Masyarakat Masjid"',
//       to: email,
//       subject: 'Your Temporary Password',
//       html: `
//         <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
//           <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
//             <h1 style="color: #1a365d;">Temporary Password</h1>
//           </div>
//           <div style="padding: 20px;">
//             <p>You have requested a temporary password for your Masyarakat Masjid account.</p>
            
//             <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; text-align: center; border-radius: 5px;">
//               <p style="font-size: 18px; margin: 0;">Your temporary password is:</p>
//               <p style="font-size: 24px; font-weight: bold; color: #4a90e2; margin: 10px 0;">${temporaryPassword}</p>
//             </div>
            
//             <p style="color: #d63031; font-weight: bold;">Important Security Notice:</p>
//             <ul style="color: #666;">
//               <li>Please log in with this temporary password as soon as possible.</li>
//               <li>You will be required to change your password upon logging in.</li>
//               <li>For security reasons, this temporary password will expire in 24 hours.</li>
//             </ul>
            
//             <p style="margin-top: 30px; color: #666;">
//               If you didn't request a temporary password, please contact our support team immediately.
//             </p>
//           </div>
//           <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
//             <p>This is an automated message, please do not reply to this email.</p>
//           </div>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Temporary password email sent successfully to:', email);
//   } catch (error) {
//     console.error('Failed to send temporary password email:', error);
//     throw new Error('Unable to send temporary password email');
//   }
// };


// const sendFlagNotification = async (recipients, serviceDetails, flagMessage) =>{
//   try{  
//   const emailContent = {
//       subject: `Service Flagged: ${serviceDetails.name}`,
//       html: `
//         <h2>Service Has Been Flagged</h2>
//         <p><strong>Service Name:</strong> ${serviceDetails.name}</p>
//         <p><strong>Flag Message:</strong> ${flagMessage}</p>
//         <p><strong>Flagged Date:</strong> ${new Date().toLocaleDateString()}</p>
//         <p>Please review this service in your admin dashboard.</p>
//         <p><a href="${process.env.FRONTEND_URL}/services/${serviceDetails._id}">View Service</a></p>
//       `
//     };

//     for (const recipient of recipients) {
//       await transporter.sendMail(mailOptions);
//     }
//   }catch (error) {
//     console.error('Failed to send flagged email:', error);
//     throw new Error('Unable to send flagged email');
//   }
//   }




// module.exports = { sendEmail,sendTemporaryPassword };
// services/emailService.js
const nodemailer = require('nodemailer');
const emailTemplates = require('../utils/emailsTemplate');
const dotenv = require('dotenv');

dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // debug: true, // Enable debug logs
  // logger: true,
});



const sendEmail = async (to, template, data) => {
  try {

    const emailContent = emailTemplates[template](data);
    console.log('Sending email to:', to);
    console.log('Email content:', emailContent);
    
    const mailOptions = {
      from: '"Masyarakat Masjid"',
      to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    await transporter.sendMail(mailOptions);
    console.log(`${template} email sent successfully to:`, to);
  } catch (error) {
    console.error(`Failed to send ${template} email:`, error);
    throw new Error(`Unable to send ${template} email`);
  }
};

// Example usage:
// await sendEmail(user.email, 'verificationEmail', verificationLink);
// await sendEmail(user.email, 'temporaryPassword', temporaryPassword);
// await sendEmail(user.email, 'bookingApproved', bookingDetails);
// await sendEmail(user.email, 'bookingRejected', bookingDetails);
// await sendEmail(adminEmail, 'serviceFlagged', { serviceDetails, flagMessage });

module.exports = { sendEmail };