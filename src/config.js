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

  // Whatsaap
  whatsappPhoneId: 897550086768330,   // ID del número
  whatsappToken: EAAUyO75ogaQBPyNM6jlgOJnvhODaVJrZAnZCTb2ER5aqHZB8UfYmsS99dwtlzrZCmBru0UoXWCYaZCiMOXAEDy7izlbJQJW3ugqQDaKJPFUcMSMXb9X6D42zBfJz3vL0ZCngkVOVRhULETtfM5ErFNiQXY1khvAVwpUHDdPi1ehHtMGaXNJRpl116bVuHuUQkQCq85wskfki6tpKpXZB0JcuTYfFJ8PmJVZCv16LW2KZAy86ZBubZCOL8pD9CLVMJ6d6BSb6TWTcUhPkRX4k89OKLijHqTdJdLmwdLCsEJFDAZDZD,        // TOKEN (Identificador de acceso)

  // Enlace a Mercado Pago
  mpLink: required('MP_LINK'),

  // Clave de cifrado local (si la usás)
  encryptionKey: required('ENCRYPTION_KEY'),
};
