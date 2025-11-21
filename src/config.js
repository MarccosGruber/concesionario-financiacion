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
  whatsappToken: "EAAUyO75ogaQBQKfFd0S83equdam1QTQIR7hR8WEkbgR7NQ9E08HOERGs176e79RL71jzwvdZALYQldrhiaNjdjAARs71Sm5YCQEZAlVI8x10jTZAD2SGek8zZCQ8KAHsPah7WBoiJpGHeFIg5Nmy72fizMJkaBGaztYqQ5D3poXrZBuFRsUnRx6Ip1ZArrKPodz9vOseDs1lNECrajaMZBafoRFjZCfOe97vnXdjh0mKl2SLRGjAsCWgGZAqdzjLd99yHZCZASM0kXnMpvaZC6jXypa9ZAPaTv4WVtKZAMM4IgJG8ZD",

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
