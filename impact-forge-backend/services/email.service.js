import nodemailer from "nodemailer";

/**
 * Email Service
 * Handles all email-related operations
 */

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send Email
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.html - HTML content
 * @param {String} options.text - Plain text content (optional)
 * @param {Array} options.attachments - Email attachments (optional)
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendEmail = async ({ to, subject, html, text, attachments = [] }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML tags for text version
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email error: ${error.message}`);
    throw error;
  }
};

/**
 * Send Donation Confirmation Email
 * @param {Object} donation - Donation object
 * @returns {Promise}
 */
export const sendDonationConfirmation = async (donation) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .details { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Your Donation!</h1>
        </div>
        <div class="content">
          <p>Dear ${donation.donor_name},</p>
          <p>We are grateful for your generous donation of <strong>₹${donation.amount}</strong>.</p>
          <div class="details">
            <h3>Donation Details:</h3>
            <p><strong>Transaction ID:</strong> ${donation.transaction_id}</p>
            <p><strong>Amount:</strong> ₹${donation.amount}</p>
            <p><strong>Date:</strong> ${new Date(donation.created_at).toLocaleDateString()}</p>
            ${donation.project_id ? `<p><strong>Project:</strong> ${donation.project_id}</p>` : ""}
          </div>
          <p>Your contribution will help us make a positive impact in the community.</p>
          <p>You will receive a tax receipt shortly.</p>
        </div>
        <div class="footer">
          <p>Thank you for supporting Vidhyalok Trust of Education</p>
          <p>For any queries, contact us at info@vidhyaloktrust.org</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: donation.donor_email,
    subject: "Donation Confirmation - Vidhyalok Trust of Education",
    html,
  });
};

/**
 * Send Volunteer Registration Confirmation
 * @param {Object} volunteer - Volunteer object
 * @returns {Promise}
 */
export const sendVolunteerConfirmation = async (volunteer) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Volunteer Registration Received!</h1>
        </div>
        <div class="content">
          <p>Dear ${volunteer.first_name} ${volunteer.last_name},</p>
          <p>Thank you for your interest in volunteering with Vidhyalok Trust of Education!</p>
          <p>We have received your application and our team will review it shortly.</p>
          <p>You will be contacted within 5-7 business days regarding the next steps.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
        <div class="footer">
          <p>Thank you for your commitment to making a difference!</p>
          <p>Vidhyalok Trust of Education Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: volunteer.email,
    subject: "Volunteer Registration Confirmation - Vidhyalok Trust of Education",
    html,
  });
};

/**
 * Send Password Reset Email
 * @param {String} email - User email
 * @param {String} resetToken - Password reset token
 * @param {String} resetUrl - Password reset URL
 * @returns {Promise}
 */
export const sendPasswordReset = async (email, resetToken, resetUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #FF9800; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background: #FF9800; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>You have requested to reset your password.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>Or copy and paste this link in your browser:</p>
          <p>${resetUrl}</p>
          <p><strong>This link will expire in 10 minutes.</strong></p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>Vidhyalok Trust of Education</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Password Reset Request - Vidhyalok Trust of Education",
    html,
  });
};

/**
 * Send Event Registration Confirmation
 * @param {Object} registration - Event registration object
 * @param {Object} event - Event object
 * @returns {Promise}
 */
export const sendEventRegistrationConfirmation = async (registration, event) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #9C27B0; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .details { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Event Registration Confirmed!</h1>
        </div>
        <div class="content">
          <p>Dear ${registration.participant_name},</p>
          <p>Your registration for the event has been confirmed.</p>
          <div class="details">
            <h3>Event Details:</h3>
            <p><strong>Event:</strong> ${event.title}</p>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            ${event.address ? `<p><strong>Address:</strong> ${event.address}</p>` : ""}
          </div>
          <p>We look forward to seeing you at the event!</p>
        </div>
        <div class="footer">
          <p>Vidhyalok Trust of Education</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: registration.participant_email,
    subject: `Event Registration Confirmed - ${event.title}`,
    html,
  });
};

/**
 * Send Newsletter Welcome Email
 * @param {String} email - Subscriber email
 * @returns {Promise}
 */
export const sendNewsletterWelcome = async (email) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Our Newsletter!</h1>
        </div>
        <div class="content">
          <p>Thank you for subscribing to Vidhyalok Trust of Education newsletter!</p>
          <p>You will now receive updates about our projects, events, and impact stories.</p>
          <p>Stay tuned for inspiring stories and ways to get involved!</p>
        </div>
        <div class="footer">
          <p>Vidhyalok Trust of Education</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Welcome to Vidhyalok Trust of Education Newsletter",
    html,
  });
};

/**
 * Send Contact Form Submission Confirmation
 * @param {Object} submission - Contact submission object
 * @returns {Promise}
 */
export const sendContactConfirmation = async (submission) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Contacting Us!</h1>
        </div>
        <div class="content">
          <p>Dear ${submission.first_name} ${submission.last_name},</p>
          <p>We have received your message and will get back to you within 24-48 hours.</p>
          <p><strong>Subject:</strong> ${submission.subject}</p>
          <p>Our team is reviewing your inquiry and will respond soon.</p>
        </div>
        <div class="footer">
          <p>Vidhyalok Trust of Education Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: submission.email,
    subject: "Thank You for Contacting Vidhyalok Trust of Education",
    html,
  });
};

/**
 * Send Project Announcement to Newsletter Subscribers
 * @param {Object} project - Project object
 * @param {Array} subscribers - Array of subscriber emails
 * @returns {Promise}
 */
export const sendProjectAnnouncement = async (project, subscribers) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .details { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Project Launched!</h1>
        </div>
        <div class="content">
          <p>We're excited to announce a new project!</p>
          <div class="details">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            ${project.location ? `<p><strong>Location:</strong> ${project.location}</p>` : ""}
            ${project.start_date ? `<p><strong>Start Date:</strong> ${new Date(project.start_date).toLocaleDateString()}</p>` : ""}
          </div>
          <p>Learn more about this project and how you can get involved!</p>
        </div>
        <div class="footer">
          <p>Vidhyalok Trust of Education</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send to all active subscribers
  const emailPromises = subscribers.map((subscriber) =>
    sendEmail({
      to: subscriber.email,
      subject: `New Project: ${project.title} - Vidhyalok Trust of Education`,
      html,
    }).catch((error) => {
      console.error(`Failed to send email to ${subscriber.email}:`, error);
      return null;
    })
  );

  await Promise.allSettled(emailPromises);
};

/**
 * Send Event Announcement to Newsletter Subscribers
 * @param {Object} event - Event object
 * @param {Array} subscribers - Array of subscriber emails
 * @returns {Promise}
 */
export const sendEventAnnouncement = async (event, subscribers) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #9C27B0; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .details { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 24px; background: #9C27B0; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Event Announced!</h1>
        </div>
        <div class="content">
          <p>We're excited to announce a new event!</p>
          <div class="details">
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            ${event.time ? `<p><strong>Time:</strong> ${event.time}</p>` : ""}
            <p><strong>Location:</strong> ${event.location}</p>
            ${event.address ? `<p><strong>Address:</strong> ${event.address}</p>` : ""}
          </div>
          <p>Join us for this exciting event!</p>
        </div>
        <div class="footer">
          <p>Vidhyalok Trust of Education</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send to all active subscribers
  const emailPromises = subscribers.map((subscriber) =>
    sendEmail({
      to: subscriber.email,
      subject: `New Event: ${event.title} - Vidhyalok Trust of Education`,
      html,
    }).catch((error) => {
      console.error(`Failed to send email to ${subscriber.email}:`, error);
      return null;
    })
  );

  await Promise.allSettled(emailPromises);
};

/**
 * Send Volunteer Status Update Email
 * @param {Object} volunteer - Volunteer object
 * @param {String} oldStatus - Previous status
 * @returns {Promise}
 */
export const sendVolunteerStatusUpdate = async (volunteer, oldStatus) => {
  const statusMessages = {
    active: "Your volunteer application has been approved! Welcome to the team!",
    rejected: "We regret to inform you that your volunteer application was not approved at this time.",
    inactive: "Your volunteer status has been changed to inactive.",
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Volunteer Status Update</h1>
        </div>
        <div class="content">
          <p>Dear ${volunteer.first_name} ${volunteer.last_name},</p>
          <p>${statusMessages[volunteer.status] || "Your volunteer status has been updated."}</p>
          <p><strong>New Status:</strong> ${volunteer.status}</p>
          ${volunteer.status === "active" ? "<p>We look forward to working with you!</p>" : ""}
        </div>
        <div class="footer">
          <p>Vidhyalok Trust of Education Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: volunteer.email,
    subject: `Volunteer Status Update - Vidhyalok Trust of Education`,
    html,
  });
};

/**
 * Send Event Registration Status Update Email
 * @param {Object} registration - Event registration object
 * @param {Object} event - Event object
 * @param {String} oldStatus - Previous status
 * @returns {Promise}
 */
export const sendEventRegistrationStatusUpdate = async (registration, event, oldStatus) => {
  const statusMessages = {
    confirmed: "Your event registration has been confirmed!",
    cancelled: "Your event registration has been cancelled.",
    attended: "Thank you for attending the event!",
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #9C27B0; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .details { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Event Registration Status Update</h1>
        </div>
        <div class="content">
          <p>Dear ${registration.participant_name},</p>
          <p>${statusMessages[registration.status] || "Your event registration status has been updated."}</p>
          <div class="details">
            <h3>Event Details:</h3>
            <p><strong>Event:</strong> ${event.title}</p>
            <p><strong>Status:</strong> ${registration.status}</p>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            ${event.time ? `<p><strong>Time:</strong> ${event.time}</p>` : ""}
            <p><strong>Location:</strong> ${event.location}</p>
          </div>
        </div>
        <div class="footer">
          <p>Vidhyalok Trust of Education</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: registration.participant_email,
    subject: `Event Registration Status Update - ${event.title}`,
    html,
  });
};

/**
 * Send Contact Submission Status Update Email
 * @param {Object} submission - Contact submission object
 * @param {String} oldStatus - Previous status
 * @returns {Promise}
 */
export const sendContactStatusUpdate = async (submission, oldStatus) => {
  const statusMessages = {
    read: "We have read your message and are working on a response.",
    replied: "We have replied to your message. Please check your email.",
    archived: "Your message has been archived.",
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Contact Status Update</h1>
        </div>
        <div class="content">
          <p>Dear ${submission.first_name} ${submission.last_name},</p>
          <p>${statusMessages[submission.status] || "Your contact submission status has been updated."}</p>
          <p><strong>Subject:</strong> ${submission.subject}</p>
          <p><strong>Status:</strong> ${submission.status}</p>
        </div>
        <div class="footer">
          <p>Vidhyalok Trust of Education Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: submission.email,
    subject: `Contact Status Update - Vidhyalok Trust of Education`,
    html,
  });
};

/**
 * Send Donation Status Update Email
 * @param {Object} donation - Donation object
 * @param {String} oldStatus - Previous status
 * @returns {Promise}
 */
export const sendDonationStatusUpdate = async (donation, oldStatus) => {
  const statusMessages = {
    completed: "Your donation has been successfully processed. Thank you!",
    failed: "Unfortunately, your donation payment failed. Please try again.",
    refunded: "Your donation has been refunded.",
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .details { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Donation Status Update</h1>
        </div>
        <div class="content">
          <p>Dear ${donation.donor_name},</p>
          <p>${statusMessages[donation.status] || "Your donation status has been updated."}</p>
          <div class="details">
            <p><strong>Transaction ID:</strong> ${donation.transaction_id}</p>
            <p><strong>Amount:</strong> ₹${donation.amount}</p>
            <p><strong>Status:</strong> ${donation.status}</p>
            <p><strong>Date:</strong> ${new Date(donation.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div class="footer">
          <p>Vidhyalok Trust of Education</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: donation.donor_email,
    subject: `Donation Status Update - Vidhyalok Trust of Education`,
    html,
  });
};

