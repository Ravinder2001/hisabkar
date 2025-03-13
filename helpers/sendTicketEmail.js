const sendEmail = require("./sendEmail"); // Import your sendEmail function
const config = require("../configuration/config");

async function sendTicketEmails(ticket) {
  const adminEmail = config.NODEMAILER.EMAIL; // Define your admin email in config
  const { email, ticket_type, description } = ticket;

  // Define email subjects and messages for different ticket types
  const subjectMap = {
    SUPPORT: "Support Ticket Created",
    BUG: "Bug Report Submitted",
    FEEDBACK: "Feedback Received",
  };

  // Define custom messages for each ticket type
  const messageMap = {
    SUPPORT: `
      Hello,

      Thank you for reaching out! Your support request has been successfully submitted.

      Description:
      ${description}

      Our support team is on it and will respond to you as soon as possible to assist with your query.

      Regards,
      Hisabkar Support Team
    `,
    BUG: `
      Hello,

      Thank you for reporting a bug! Your submission has been received.

      Description:
      ${description}

      Our technical team will investigate the issue and work on a fix. We’ll keep you updated on our progress.

      Regards,
      Hisabkar Support Team
    `,
    FEEDBACK: `
      Hello,

      Thank you for sharing your feedback! We’ve successfully received it.

      Description:
      ${description}

      Your input means a lot to us, and our team will review it carefully to help improve our services.

      Regards,
      Hisabkar Support Team
    `,
  };

  // Send email to the user
  await sendEmail(email, {
    subject: subjectMap[ticket_type],
    text: messageMap[ticket_type],
  });

  // Send email to the admin
  await sendEmail(adminEmail, {
    subject: `New ${ticket_type} Ticket Received`,
    text: `
      A new ${ticket_type.toLowerCase()} ticket has been submitted.

      User Email: ${email}
      Description: ${description}

      Please review it at your earliest convenience.
    `,
  });
}

module.exports = sendTicketEmails;
