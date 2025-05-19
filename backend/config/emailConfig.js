
const { sendEmail } = require('../utils/emailService');

// Function to check email configuration
const checkEmailConfig = () => {
  const emailProvider = process.env.EMAIL_PROVIDER;
  const mailtrapUser = process.env.MAILTRAP_USER;
  const mailtrapPass = process.env.MAILTRAP_PASS;
  
  if (!emailProvider) {
    console.warn('Warning: EMAIL_PROVIDER not set. Defaulting to mailtrap.');
  }
  
  if (emailProvider === 'mailtrap' && (!mailtrapUser || !mailtrapPass)) {
    console.error('Error: Mailtrap credentials not set. Email functionality will not work.');
    return false;
  }
  
  console.log(`Email provider configured: ${emailProvider || 'mailtrap (default)'}`);
  return true;
};

module.exports = { checkEmailConfig, sendEmail };