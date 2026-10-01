/**
 * ============================================================================
 * SERVICE: REAL SMS GATEWAY INTEGRATION (smsService.js)
 * ============================================================================
 * Handles sending real Cellular SMS notifications directly to Admin mobile phone (9670912923)
 * Supports:
 * 1. Fast2SMS API (Popular Indian SMS Gateway - www.fast2sms.com)
 * 2. Twilio SMS API
 * 3. Fallback HTTP Webhooks
 */

import fetch from 'node-fetch';

/**
 * Sends a real cellular SMS alert to the target phone number
 * @param {string} toPhone - Recipient phone number (e.g. '9670912923')
 * @param {string} messageText - Plain text message content
 */
export async function sendRealSMS(toPhone, messageText) {
  const cleanPhone = toPhone ? toPhone.replace(/[^0-9]/g, '').slice(-10) : '9670912923';
  const fast2smsKey = process.env.FAST2SMS_API_KEY;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

  console.log(`\n======================================================`);
  console.log(`📡 SENDING REAL MOBILE SMS NOTIFICATION`);
  console.log(`📱 Destination Number: +91 ${cleanPhone}`);
  console.log(`💬 Message Content:    ${messageText}`);

  // 1. Fast2SMS Gateway Integration (India)
  if (fast2smsKey) {
    try {
      console.log(`🚀 Dispatching SMS via Fast2SMS API Gateway...`);
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': fast2smsKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'q',
          message: messageText,
          language: 'english',
          flash: '0',
          numbers: cleanPhone
        })
      });
      const resData = await response.json();
      console.log(`✅ Fast2SMS API Response:`, resData);
      return { success: true, provider: 'Fast2SMS', response: resData };
    } catch (err) {
      console.error(`❌ Fast2SMS Dispatch Failed:`, err.message);
    }
  }

  // 2. Twilio Gateway Integration
  if (twilioSid && twilioAuthToken && twilioPhone) {
    try {
      console.log(`🚀 Dispatching SMS via Twilio API Gateway...`);
      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', `+91${cleanPhone}`);
      params.append('From', twilioPhone);
      params.append('Body', messageText);

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });
      const resData = await response.json();
      console.log(`✅ Twilio API Response:`, resData);
      return { success: true, provider: 'Twilio', response: resData };
    } catch (err) {
      console.error(`❌ Twilio Dispatch Failed:`, err.message);
    }
  }

  // 3. Fallback / Setup guide log
  console.log(`⚠️ NOTE: Fast2SMS or Twilio API Key not found in backend/.env.`);
  console.log(`💡 To receive REAL SMS on +91 ${cleanPhone}, add FAST2SMS_API_KEY in backend/.env!`);
  console.log(`======================================================\n`);

  return { 
    success: false, 
    message: 'SMS Gateway credentials missing in .env. Please set FAST2SMS_API_KEY to send real SIM card SMS.' 
  };
}
