const axios = require('axios');

/**
 * Send WhatsApp message using WhatsApp Business API
 * @param {string} phoneNumber - Recipient's phone number (with country code)
 * @param {string} message - Message to send
 */
const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    const url = `${process.env.WHATSAPP_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    
    const response = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: {
          body: message
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('WhatsApp message sent successfully:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send approval notification
 * @param {string} phoneNumber - Student's phone number
 * @param {string} name - Student's name
 * @param {string} blockchainId - Generated blockchain ID
 */
const sendApprovalNotification = async (phoneNumber, name, blockchainId) => {
  const message = `🎓 Campus Companion App\n\nHello ${name}!\n\nYour account has been approved! ✅\n\nYour Blockchain Student ID: ${blockchainId}\n\nYou can now access your dashboard and all campus features.\n\nWelcome aboard!`;
  
  return await sendWhatsAppMessage(phoneNumber, message);
};

/**
 * Send rejection notification
 * @param {string} phoneNumber - Student's phone number
 * @param {string} name - Student's name
 * @param {string} reason - Reason for rejection
 */
const sendRejectionNotification = async (phoneNumber, name, reason = '') => {
  const message = `🎓 Campus Companion App\n\nHello ${name},\n\nUnfortunately, your registration has been rejected. ❌\n\n${reason ? `Reason: ${reason}\n\n` : ''}Please contact the administration for more information.`;
  
  return await sendWhatsAppMessage(phoneNumber, message);
};

/**
 * Send event reminder
 * @param {string} phoneNumber - User's phone number
 * @param {string} eventName - Name of the event
 * @param {Date} eventDate - Event date and time
 */
const sendEventReminder = async (phoneNumber, eventName, eventDate) => {
  const message = `📅 Event Reminder\n\n"${eventName}"\n\nDate: ${eventDate.toLocaleDateString()}\nTime: ${eventDate.toLocaleTimeString()}\n\nDon't miss it!`;
  
  return await sendWhatsAppMessage(phoneNumber, message);
};

/**
 * Send assignment reminder
 * @param {string} phoneNumber - Student's phone number
 * @param {string} assignmentTitle - Title of the assignment
 * @param {Date} dueDate - Due date
 */
const sendAssignmentReminder = async (phoneNumber, assignmentTitle, dueDate) => {
  const message = `📝 Assignment Reminder\n\n"${assignmentTitle}"\n\nDue Date: ${dueDate.toLocaleDateString()}\n\nComplete your assignment on time!`;
  
  return await sendWhatsAppMessage(phoneNumber, message);
};

/**
 * Send certificate notification
 * @param {string} phoneNumber - Recipient's phone number
 * @param {string} certificateTitle - Certificate title
 * @param {string} verificationUrl - Blockchain verification URL
 */
const sendCertificateNotification = async (phoneNumber, certificateTitle, verificationUrl) => {
  const message = `🏆 Certificate Issued!\n\nCongratulations! You've received:\n"${certificateTitle}"\n\nVerify on blockchain:\n${verificationUrl}\n\nThis certificate is tamper-proof and permanently stored on blockchain.`;
  
  return await sendWhatsAppMessage(phoneNumber, message);
};

module.exports = {
  sendWhatsAppMessage,
  sendApprovalNotification,
  sendRejectionNotification,
  sendEventReminder,
  sendAssignmentReminder,
  sendCertificateNotification
};
