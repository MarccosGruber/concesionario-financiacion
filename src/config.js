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
  whatsappToken: "EAAUyO75ogaQBP6pqBLkwDvioAAAGJon30rT8j1J0um8ZAWUEdGH6m1joGN08ZBPB1qjcREoqZARo6lrj2yBYhxJ30b8lvtQKReoP9eOYaPfEOiBXxn4HE3g3ouwSRgRl7qZBPSBdV8an9DsoyFIb22mvTcan4BVYE6ahT7Nb6WfuBvJjSvPo7ypZB8GxnBo0zAEBXXsz9ZARDXPt9T1kC2BzOs8GsQlSUNk0ZACYNcWfRserrpe3GXi8JM7qpxZABp0pZBK6e6xNyy45BXEQn4FZApivliK5rtM7eoKiO22ZCQZD",

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
