import 'dotenv/config';

// Pequeña función para validar variables obligatorias
const required = (key, optional = false) => {
  const value = process.env[key];
  if (!value && !optional) {
    throw new Error(`Falta variable de entorno: ${key}`);
  }
  return value;
};

export const config = {
  // Entorno general
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),

  // Base de datos
  dbUrl: required('DATABASE_URL'),

  // Configuración general de WhatsApp
  whatsapp: {
    provider: (process.env.WHATSAPP_PROVIDER || 'twilio').toLowerCase(), // 'twilio' o 'meta'
    dryRun: String(process.env.WHATSAPP_DRY_RUN || 'true').toLowerCase() === 'true',
  },

  // Configuración de Twilio
  twilio: {
    sid: required('TWILIO_ACCOUNT_SID'),
    token: required('TWILIO_AUTH_TOKEN'),
    from: required('TWILIO_WHATSAPP_FROM'),
  },

  // Configuración de Meta (para cuando tengas acceso)
  meta: {
    phoneNumberId: process.env.META_PHONE_NUMBER_ID || '',
    wabaId: process.env.META_WABA_ID || '',
    accessToken: process.env.META_ACCESS_TOKEN || '',
    templateName: process.env.META_TEMPLATE_NAME || 'financiacion_inicial',
    templateLang: process.env.META_TEMPLATE_LANG || 'es_AR',
  },

  // Enlace a Mercado Pago
  mpLink: required('MP_LINK'),

  // Clave de cifrado local (si la usás)
  encryptionKey: required('ENCRYPTION_KEY'),
};
