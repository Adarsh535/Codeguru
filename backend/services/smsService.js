/**
 * ============================================================================
 * SERVICE: REAL SMS & OTP GATEWAY INTEGRATION (smsService.js)
 * ============================================================================
 * Handles sending real Cellular SMS notifications & OTPs to any mobile phone in India (+91).
 * Supports:
 * 1. Fast2SMS API (Fastest Indian SMS Gateway - works for all numbers without whitelist)
 * 2. 2Factor.in SMS API (Indian OTP Gateway)
 * 3. Twilio Verify & Twilio Programmable SMS API
 */

/**
 * Sends a real cellular SMS alert to the target phone number
 * @param {string} toPhone - Recipient phone number (e.g. '9670912923')
 * @param {string} messageText - Plain text message content
 */
export async function sendRealSMS(toPhone, messageText) {
  const cleanPhone = toPhone ? toPhone.replace(/[^0-9]/g, '').slice(-10) : '9670912923';
  const fast2smsKey = process.env.FAST2SMS_API_KEY;
  const twofactorKey = process.env.TWOFACTOR_API_KEY;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

  console.log(`\n======================================================`);
  console.log(`📡 SENDING REAL MOBILE SMS NOTIFICATION`);
  console.log(`📱 Destination Number: +91 ${cleanPhone}`);
  console.log(`💬 Message Content:    ${messageText}`);

  // 1. Fast2SMS Gateway Integration (India - Delivers to all numbers)
  if (fast2smsKey) {
    try {
      console.log(`🚀 Dispatching SMS via Fast2SMS Quick Gateway...`);
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
      if (resData.return === true) {
        return { success: true, provider: 'Fast2SMS', response: resData };
      }
      console.warn(`⚠️ Fast2SMS dispatch warning:`, resData.message);
    } catch (err) {
      console.error(`❌ Fast2SMS Dispatch Failed:`, err.message);
    }
  }

  // 2. 2Factor.in Gateway Integration (India)
  if (twofactorKey) {
    try {
      console.log(`🚀 Dispatching SMS via 2Factor Gateway...`);
      const url = `https://2factor.in/API/V1/${twofactorKey}/ADDON_SERVICES/SEND/PSMS`;
      const params = new URLSearchParams();
      params.append('From', 'CDGURU');
      params.append('To', cleanPhone);
      params.append('Msg', messageText);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });
      const resData = await response.json();
      if (resData.Status === 'Success') {
        return { success: true, provider: '2Factor', response: resData };
      }
    } catch (err) {
      console.error(`❌ 2Factor Dispatch Failed:`, err.message);
    }
  }

  // 3. Twilio Gateway Integration
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
      
      if (response.ok && resData.sid && !resData.code) {
        return { success: true, provider: 'Twilio', response: resData };
      }
      console.warn(`❌ Twilio SMS Error [${resData.code}]:`, resData.message);
      return { success: false, provider: 'Twilio', error: resData.message, code: resData.code };
    } catch (err) {
      console.error(`❌ Twilio Dispatch Failed:`, err.message);
      return { success: false, provider: 'Twilio', error: err.message };
    }
  }

  return { 
    success: false, 
    provider: 'None',
    message: 'SMS Gateway credentials missing or restricted in .env. To send real SMS to all mobile numbers in India, add FAST2SMS_API_KEY in backend/.env' 
  };
}

/**
 * Sends Real SMS OTP using Indian Gateways (Fast2SMS, 2Factor) or Twilio Verify
 * @param {string} toPhone - 10-digit mobile number
 * @param {string} customOtp - 6-digit verification code
 */
export async function sendOtpSMS(toPhone, customOtp = null) {
  const cleanPhone = toPhone ? toPhone.replace(/[^0-9]/g, '').slice(-10) : '';
  const otpCode = customOtp || Math.floor(100000 + Math.random() * 900000).toString();
  const fast2smsKey = process.env.FAST2SMS_API_KEY;
  const twofactorKey = process.env.TWOFACTOR_API_KEY;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  console.log(`\n======================================================`);
  console.log(`📱 DISPATCHING REAL CELLULAR SMS OTP TO: +91 ${cleanPhone}`);
  console.log(`🔑 OTP Code: ${otpCode}`);

  // 1. Fast2SMS Integration (India - Delivers real SMS to ANY mobile number)
  if (fast2smsKey) {
    try {
      console.log(`🚀 Sending via Fast2SMS Indian SMS Gateway...`);
      // Try Fast2SMS Quick Route first
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': fast2smsKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'q',
          message: `Your CodeGurru login OTP is ${otpCode}. Valid for 10 minutes. Do not share with anyone.`,
          language: 'english',
          flash: '0',
          numbers: cleanPhone
        })
      });
      const resData = await response.json();
      console.log(`✅ Fast2SMS Response:`, resData);
      if (resData.return === true) {
        console.log(`🎉 Fast2SMS cellular OTP delivered to +91 ${cleanPhone}`);
        return { success: true, provider: 'Fast2SMS', otp: otpCode, response: resData };
      }

      // If quick route fails, try Fast2SMS otp route
      const otpRouteResp = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': fast2smsKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          variables_values: otpCode,
          route: 'otp',
          numbers: cleanPhone
        })
      });
      const otpRouteData = await otpRouteResp.json();
      console.log(`✅ Fast2SMS OTP Route Response:`, otpRouteData);
      if (otpRouteData.return === true) {
        return { success: true, provider: 'Fast2SMS', otp: otpCode, response: otpRouteData };
      }
    } catch (err) {
      console.error(`❌ Fast2SMS OTP Dispatch Error:`, err.message);
    }
  }

  // 2. 2Factor.in Integration (India)
  if (twofactorKey) {
    try {
      console.log(`🚀 Sending via 2Factor.in Gateway...`);
      const response = await fetch(`https://2factor.in/API/V1/${twofactorKey}/SMS/+91${cleanPhone}/${otpCode}/CodeGurru`, {
        method: 'GET'
      });
      const resData = await response.json();
      if (resData.Status === 'Success') {
        return { success: true, provider: '2Factor', otp: otpCode, response: resData };
      }
    } catch (err) {
      console.error(`❌ 2Factor OTP Dispatch Error:`, err.message);
    }
  }

  // 3. Twilio Verify API (Delivers real OTP if account is paid or number is verified in Twilio Console)
  if (twilioSid && twilioAuthToken && verifyServiceSid) {
    try {
      console.log(`🚀 Attempting Twilio Verify Service (${verifyServiceSid})...`);
      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', `+91${cleanPhone}`);
      params.append('Channel', 'sms');

      const response = await fetch(`https://verify.twilio.com/v2/Services/${verifyServiceSid}/Verifications`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      const resData = await response.json();
      console.log(`📡 Twilio Verify Response:`, resData);

      if ((resData.status === 'pending' || resData.status === 'approved') && !resData.code) {
        console.log(`🎉 Twilio Verify cellular SMS dispatched to +91 ${cleanPhone}`);
        return { success: true, provider: 'TwilioVerify', otp: otpCode, response: resData };
      }

      console.warn(`⚠️ Twilio Verify failed for +91 ${cleanPhone}: Code ${resData.code} - ${resData.message}`);
    } catch (err) {
      console.error(`❌ Twilio Verify Dispatch Error:`, err.message);
    }
  }

  // 4. Twilio Standard SMS Fallback
  const messageText = `Your CodeGurru Login Verification OTP is ${otpCode}. Valid for 10 minutes.`;
  const fallbackResult = await sendRealSMS(cleanPhone, messageText);
  if (fallbackResult.success) {
    return { success: true, provider: fallbackResult.provider, otp: otpCode, response: fallbackResult.response };
  }

  // Gateway failed or trial account restricted
  console.log(`⚠️ All cellular SMS gateways unavailable or restricted by Twilio Trial.`);
  console.log(`💡 Generated OTP for +91 ${cleanPhone} is: ${otpCode}`);
  console.log(`======================================================\n`);

  return { 
    success: false, 
    provider: 'Simulation',
    otp: otpCode,
    message: 'Twilio Trial Account can only send to verified developer phone numbers. To send SMS to ALL mobile numbers in India, configure FAST2SMS_API_KEY in backend/.env'
  };
}

/**
 * Checks/Verifies OTP with Twilio Verify
 * @param {string} toPhone - 10-digit mobile number
 * @param {string} code - OTP code entered by user
 */
export async function checkTwilioVerify(toPhone, code) {
  const cleanPhone = toPhone ? toPhone.replace(/[^0-9]/g, '').slice(-10) : '';
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (twilioSid && twilioAuthToken && verifyServiceSid) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', `+91${cleanPhone}`);
      params.append('Code', code.toString().trim());

      const response = await fetch(`https://verify.twilio.com/v2/Services/${verifyServiceSid}/VerificationCheck`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      const resData = await response.json();
      console.log(`🔍 Twilio VerificationCheck Response:`, resData);
      if (resData.status === 'approved' && resData.valid === true) {
        return true;
      }
    } catch (err) {
      console.error(`❌ Twilio VerificationCheck Error:`, err.message);
    }
  }
  return false;
}


