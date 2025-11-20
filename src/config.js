import 'dotenv/config';

const required = (key, optional = false) => {
  const value = process.env[key];
  if (!value && !optional) {
    throw new Error(`Falta variable de entorno: ${key}`);
  }
  return value;
};

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),

  dbUrl: required('DATABASE_URL'),

  whatsapp: {
    provider: (process.env.WHATSAPP_PROVIDER || 'meta').toLowerCase(),
    dryRun: String(process.env.WHATSAPP_DRY_RUN || 'false').toLowerCase() === 'true',
  },

  // WhatsApp Cloud API
  whatsappPhoneId: "897550086768330",
  whatsappToken: "EAAUyO75ogaQBPyWYJSx05IlHn3sEJJgGLvi33qgwmK9RyREb8uCFWOm5jElZAn3ttCBcvtZCZBadjc49WzAPUw2zyO3n0CAGxyurrqTrsKvFqBODR4Lw6ubUWJUIZCNPDTqIxFqr3TkaI5t60Nc7xY8a4fUuMIwZBSaJAEBEh0Gx7FxUfgGcar1J8YtJ8g2XjJLhLNW9jijyhT7ILYucmCVJ8krFAvwvaPJiQ7M4XqFJtUBH3cYwe4ZByniUVQyJNMhcrqKFZAqLy8gJlOSvmZAzBqIMXzQC2mxxvDzpPQZDZD",

  // Twilio (no usado si whatsapp.provider = meta)
  twilio: {
    sid: process.env.TWILIO_ACCOUNT_SID,
    token: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_WHATSAPP_FROM,
  },

  mpLink: required('MP_LINK'),
  encryptionKey: required('ENCRYPTION_KEY'),
};
