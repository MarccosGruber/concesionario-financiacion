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
  whatsappToken: "EAAUyO75ogaQBPZBghndGnyZAV4v1DgLsgIJIHCK10VABHpZA6vQ70j2ryX317PykzZADgGktxe2gHWpMaH0BdZCQCVmXwGZChZC2ZAuJKU5PqUHFIU2dnt2kkk60y0YvhzjuPeZCZAcZAklGvIHRMHh5p8iNQ5atB3N7cpfpfKu191w2ZCodQYHo4bD0OoGO1aZBVNbIbvCrJy0sJ7CxODPv5KIiVAONwb8AMldl6zE4zzXLBax7kgsiPBa75FSw8kZAeDjpu78xrAMs6QkHHmjZAfbgttZC3wuIHHZBxblSeLfI2jkQZD",

  // Twilio (no usado si whatsapp.provider = meta)
  twilio: {
    sid: process.env.TWILIO_ACCOUNT_SID,
    token: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_WHATSAPP_FROM,
  },

  mpLink: required('MP_LINK'),
  encryptionKey: required('ENCRYPTION_KEY'),
};
