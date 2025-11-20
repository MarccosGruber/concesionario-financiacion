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
  whatsappToken: "EAAUyO75ogaQBP4RP4GK9obsr7nYrra21LV26fUsk9QF412t7LZBNZCm0y0HjsLqtfnyFMy2BYLpR4csh00Cwk23VL1UAevRuebkXJ9JWtzWZCK2psOhVi2MZCUE9gHz3oqLegrRUvtFGdrZBiDm0UO0T6JQjfIZApsWncAuLlIba1SZAqvTTOIGCgnZAxbn68ZAHu82uv6wWuqxos67YqXLHF91mnTKOuN2DLLKSmReUKcb6h26UFrcRDpZB7wSVzmiqXTONE5sZA7boUoaFsPtsB0lBPrfy0BKNlYeVQ5oUQZDZD",

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
