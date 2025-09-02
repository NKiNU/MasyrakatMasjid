// utils/emailTemplates.js
const getEmailStyles = () => ({
    container: `max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;`,
    header: `background-color: #f8f9fa; padding: 20px; text-align: center;`,
    headerTitle: `color: #1a365d;`,
    content: `padding: 20px;`,
    button: `background-color: #4a90e2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;`,
    footer: `background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;`,
    infoBox: `background-color: #f5f5f5; padding: 15px; margin: 20px 0; text-align: center; border-radius: 5px;`
  });
  
  const emailTemplates = {
    verificationEmail: (verificationLink) => ({
      subject: 'Verify Your Email Address',
      html: `
        <div style="${getEmailStyles().container}">
          <div style="${getEmailStyles().header}">
            <h1 style="${getEmailStyles().headerTitle}">Email Verification</h1>
          </div>
          <div style="${getEmailStyles().content}">
            <p>Thank you for registering with Masyarakat Masjid. Please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="${getEmailStyles().button}">
                Verify Email
              </a>
            </div>
            
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4a90e2;">${verificationLink}</p>
            
            <p style="margin-top: 30px; color: #666;">
              If you didn't create an account with Masyarakat Masjid, please ignore this email.
            </p>
          </div>
        </div>
      `
    }),
  
    temporaryPassword: (temporaryPassword) => ({
      subject: 'Your Temporary Password',
      html: `
        <div style="${getEmailStyles().container}">
          <div style="${getEmailStyles().header}">
            <h1 style="${getEmailStyles().headerTitle}">Temporary Password</h1>
          </div>
          <div style="${getEmailStyles().content}">
            <p>You have requested a temporary password for your Masyarakat Masjid account.</p>
            
            <div style="${getEmailStyles().infoBox}">
              <p style="font-size: 18px; margin: 0;">Your temporary password is:</p>
              <p style="font-size: 24px; font-weight: bold; color: #4a90e2; margin: 10px 0;">${temporaryPassword}</p>
            </div>
            
            <p style="color: #d63031; font-weight: bold;">Important Security Notice:</p>
            <ul style="color: #666;">
              <li>Please log in with this temporary password as soon as possible.</li>
              <li>You will be required to change your password upon logging in.</li>
              <li>For security reasons, this temporary password will expire in 24 hours.</li>
            </ul>
          </div>
          <div style="${getEmailStyles().footer}">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      `
    }),
  
    bookingApproved: (bookingDetails) => ({
      subject: 'Booking Approved',
      html: `
        <div style="${getEmailStyles().container}">
          <div style="${getEmailStyles().header}">
            <h1 style="${getEmailStyles().headerTitle}">Your booking has been approved!</h1>
          </div>
          <div style="${getEmailStyles().content}">
            <div style="${getEmailStyles().infoBox}">
              <h2 style="margin: 0; color: #4a90e2;">Booking Details</h2>
              <p style="font-size: 16px;"><strong>Service:</strong> ${bookingDetails.serviceName}</p>
              <p style="font-size: 16px;"><strong>Date:</strong> ${new Date(bookingDetails.bookingDate).toLocaleDateString()}</p>
              <p style="font-size: 16px;"><strong>Time:</strong> ${bookingDetails.timeSlot.startTime}</p>
            </div>
            
            ${bookingDetails.adminNotes ? `
              <div style="margin-top: 20px;">
                <p style="color: #666;"><strong>Admin Notes:</strong></p>
                <p style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">${bookingDetails.adminNotes}</p>
              </div>
            ` : ''}
            
            <p style="margin-top: 20px;">We look forward to seeing you!</p>
          </div>
          <div style="${getEmailStyles().footer}">
            <p>If you need to make any changes, please contact us.</p>
          </div>
        </div>
      `
    }),
  
    bookingRejected: (bookingDetails) => ({
      subject: 'Booking Update',
      html: `
        <div style="${getEmailStyles().container}">
          <div style="${getEmailStyles().header}">
            <h1 style="${getEmailStyles().headerTitle}">Booking Status Update</h1>
          </div>
          <div style="${getEmailStyles().content}">
            <p>We regret to inform you that your booking has been declined.</p>
            
            <div style="${getEmailStyles().infoBox}">
              <h2 style="margin: 0; color: #4a90e2;">Booking Details</h2>
              <p style="font-size: 16px;"><strong>Service:</strong> ${bookingDetails.serviceName}</p>
              <p style="font-size: 16px;"><strong>Date:</strong> ${new Date(bookingDetails.bookingDate).toLocaleDateString()}</p>
              <p style="font-size: 16px;"><strong>Time:</strong> ${bookingDetails.timeSlot.startTime}</p>
            </div>
            
            ${bookingDetails.adminNotes ? `
              <div style="margin-top: 20px;">
                <p style="color: #666;"><strong>Reason:</strong></p>
                <p style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">${bookingDetails.adminNotes}</p>
              </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/services" style="${getEmailStyles().button}">
                Book Another Time
              </a>
            </div>
          </div>
          <div style="${getEmailStyles().footer}">
            <p>We apologize for any inconvenience. If you have any questions, please don't hesitate to contact us.</p>
          </div>
        </div>
      `
    }),
  
    serviceFlagged: (serviceDetails, flagMessage) => ({
      subject: `Service Flagged: ${serviceDetails.name}`,
      html: `
        <div style="${getEmailStyles().container}">
          <div style="${getEmailStyles().header}">
            <h1 style="${getEmailStyles().headerTitle}">Service Has Been Flagged</h1>
          </div>
          <div style="${getEmailStyles().content}">
            <div style="${getEmailStyles().infoBox}">
              <p style="font-size: 16px;"><strong>Service Name:</strong> ${serviceDetails.name}</p>
              <p style="font-size: 16px;"><strong>Flag Message:</strong> ${flagMessage}</p>
              <p style="font-size: 16px;"><strong>Flagged Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/services/${serviceDetails._id}" style="${getEmailStyles().button}">
                Review Service
              </a>
            </div>
          </div>
        </div>
      `
    }),
    bookingConfirmation: (bookingDetails) => ({
        subject: 'Booking Confirmation',
        html: `
          <div style="${getEmailStyles().container}">
            <div style="${getEmailStyles().header}">
              <h1 style="${getEmailStyles().headerTitle}">Booking Received</h1>
            </div>
            <div style="${getEmailStyles().content}">
              <p>Thank you for your booking. We have received your request and it is currently under review.</p>
              
              <div style="${getEmailStyles().infoBox}">
                <h2 style="margin: 0; color: #4a90e2;">Booking Details</h2>
                <p style="font-size: 16px;"><strong>Service:</strong> ${bookingDetails.serviceName}</p>
                <p style="font-size: 16px;"><strong>Date:</strong> ${new Date(bookingDetails.bookingDate).toLocaleDateString()}</p>
                <p style="font-size: 16px;"><strong>Time:</strong> ${bookingDetails.timeSlot.startTime}</p>
              </div>
              
              <p style="margin-top: 20px;">We will notify you once your booking has been reviewed.</p>
            </div>
            <div style="${getEmailStyles().footer}">
              <p>If you need to make any changes, please contact us.</p>
            </div>
          </div>
        `
      }),
      
    bookingCancellation: (bookingDetails) => ({
        subject: 'Booking Cancellation Confirmation',
        html: `
          <div style="${getEmailStyles().container}">
            <div style="${getEmailStyles().header}">
              <h1 style="${getEmailStyles().headerTitle}">Booking Cancelled</h1>
            </div>
            <div style="${getEmailStyles().content}">
              <div style="${getEmailStyles().infoBox}">
                <h2 style="margin: 0; color: #4a90e2;">Cancelled Booking Details</h2>
                <p style="font-size: 16px;"><strong>Service:</strong> ${bookingDetails.serviceName}</p>
                <p style="font-size: 16px;"><strong>Date:</strong> ${new Date(bookingDetails.bookingDate).toLocaleDateString()}</p>
                <p style="font-size: 16px;"><strong>Time:</strong> ${bookingDetails.timeSlot.startTime}</p>
              </div>
              
              ${bookingDetails.cancellationReason ? `
                <div style="margin-top: 20px;">
                  <p style="color: #666;"><strong>Cancellation Reason:</strong></p>
                  <p style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">${bookingDetails.cancellationReason}</p>
                </div>
              ` : ''}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/services" style="${getEmailStyles().button}">
                  Book Another Service
                </a>
              </div>
            </div>
            <div style="${getEmailStyles().footer}">
              <p>We hope to see you again soon!</p>
            </div>
          </div>
        `
      })
  };

  // Add these to your existing emailTemplates object

  
  module.exports = emailTemplates;

//   // controllers/bookingController.js
// const { sendEmail } = require('../services/emailService');
// const Booking = require('../models/Booking');
// const User = require('../models/User');

// // Update booking status controller
// const updateBookingStatus = async (req, res) => {
//   const { bookingId } = req.params;
//   const { status, adminNotes } = req.body;

//   try {
//     // Find booking with populated user and service data
//     const booking = await Booking.findById(bookingId)
//       .populate('userId', 'email emailNotifications')
//       .populate('serviceId', 'name');

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     // Update booking status
//     booking.status = status;
//     booking.adminNotes = adminNotes;
//     await booking.save();

//     // Check if user has email notifications enabled
//     if (booking.userId.emailNotifications) {
//       try {
//         const bookingDetails = {
//           serviceName: booking.serviceId.name,
//           bookingDate: booking.date,
//           timeSlot: booking.timeSlot,
//           adminNotes: adminNotes
//         };

//         // Send appropriate email based on status
//         if (status === 'approved') {
//           await sendEmail(
//             booking.userId.email,
//             'bookingApproved',
//             bookingDetails
//           );
//         } else if (status === 'rejected') {
//           await sendEmail(
//             booking.userId.email,
//             'bookingRejected',
//             bookingDetails
//           );
//         }
//       } catch (emailError) {
//         console.error('Failed to send email notification:', emailError);
//         // Continue with the response even if email fails
//       }
//     }

//     res.status(200).json({
//       message: `Booking ${status} successfully`,
//       booking
//     });

//   } catch (error) {
//     console.error('Error updating booking status:', error);
//     res.status(500).json({
//       message: 'Failed to update booking status',
//       error: error.message
//     });
//   }
// };

// // For creating new booking - you might want to send confirmation email
// const createBooking = async (req, res) => {
//   const { serviceId, date, timeSlot, notes } = req.body;
//   const userId = req.user._id; // Assuming you have user in request from auth middleware

//   try {
//     // Create booking
//     const newBooking = await Booking.create({
//       userId,
//       serviceId,
//       date,
//       timeSlot,
//       notes,
//       status: 'pending'
//     });

//     // Populate necessary fields
//     const populatedBooking = await Booking.findById(newBooking._id)
//       .populate('userId', 'email emailNotifications')
//       .populate('serviceId', 'name');

//     // Send confirmation email if user has notifications enabled
//     if (populatedBooking.userId.emailNotifications) {
//       try {
//         const bookingDetails = {
//           serviceName: populatedBooking.serviceId.name,
//           bookingDate: populatedBooking.date,
//           timeSlot: populatedBooking.timeSlot
//         };

//         // You would need to create a 'bookingConfirmation' template
//         await sendEmail(
//           populatedBooking.userId.email,
//           'bookingConfirmation',
//           bookingDetails
//         );
//       } catch (emailError) {
//         console.error('Failed to send confirmation email:', emailError);
//       }
//     }

//     res.status(201).json({
//       message: 'Booking created successfully',
//       booking: populatedBooking
//     });

//   } catch (error) {
//     console.error('Error creating booking:', error);
//     res.status(500).json({
//       message: 'Failed to create booking',
//       error: error.message
//     });
//   }
// };

// // Cancel booking controller
// const cancelBooking = async (req, res) => {
//   const { bookingId } = req.params;
//   const { reason } = req.body;

//   try {
//     const booking = await Booking.findById(bookingId)
//       .populate('userId', 'email emailNotifications')
//       .populate('serviceId', 'name');

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     booking.status = 'cancelled';
//     booking.cancellationReason = reason;
//     await booking.save();

//     // Send cancellation email if user has notifications enabled
//     if (booking.userId.emailNotifications) {
//       try {
//         const bookingDetails = {
//           serviceName: booking.serviceId.name,
//           bookingDate: booking.date,
//           timeSlot: booking.timeSlot,
//           cancellationReason: reason
//         };

//         // You would need to create a 'bookingCancellation' template
//         await sendEmail(
//           booking.userId.email,
//           'bookingCancellation',
//           bookingDetails
//         );
//       } catch (emailError) {
//         console.error('Failed to send cancellation email:', emailError);
//       }
//     }

//     res.status(200).json({
//       message: 'Booking cancelled successfully',
//       booking
//     });

//   } catch (error) {
//     console.error('Error cancelling booking:', error);
//     res.status(500).json({
//       message: 'Failed to cancel booking',
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   updateBookingStatus,
//   createBooking,
//   cancelBooking
//   // ... other booking controllers
// };