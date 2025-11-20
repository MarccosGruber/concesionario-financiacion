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
  whatsappToken: "EAAUyO75ogaQBPZBj8ChiZBETqykqQKuADmbgKfBZCgUhb5VemHAFMuFwb1vQwNTV1HMyIaElVLjIYsft7BGdDxnBPr5G7QLuCsMdQdJJva1eQaEeQLZBAcpAJ5kNgoZBGkRn2b8RepUYfQ3Uy3WWRbR7LHscEixDcIo13QC2ZCdIXZCD1gRKKKZATQNWjq3u6jSbmmDqX3nzDRxFB5Xsg8wabjyeumfBQoJpj1EP3UypTN5ZAJuFCmII5EibxBZBnM6JFNmyAOiBuS6Hvf34rZBnXa2UtqwfeZCSyoGoCezNmAZDZD",

  // Twilio (no usado si whatsapp.provider = meta)
  twilio: {
    sid: process.env.TWILIO_ACCOUNT_SID,
    token: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_WHATSAPP_FROM,
  },

  mpLink: required('MP_LINK'),
  encryptionKey: required('ENCRYPTION_KEY'),
};

{}
