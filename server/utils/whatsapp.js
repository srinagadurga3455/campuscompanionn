const axios = require('axios');

/**
 * Send WhatsApp message using WhatsApp Business API
 * @param {string} phoneNumber - Recipient's phone number (with country code, e.g., +91xxxxxxxxxx)
 * @param {string} message - Message to send
 */
const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    // Check if WhatsApp credentials are configured
    if (!process.env.WHATSAPP_API_URL || !process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
      console.log('WhatsApp API not configured - skipping notification');
      return { success: false, message: 'WhatsApp API not configured' };
    }

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

module.exports = { sendWhatsAppMessage };
