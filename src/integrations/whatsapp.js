import twilio from 'twilio';
import { config } from '../config.js';

export async function sendWhatsApp(to, message) {
  if (config.whatsapp.dryRun) {
    console.log('[WHATSAPP DRY-RUN]', { to, message });
    return;
  }

  const client = twilio(config.twilio.sid, config.twilio.token);

  const payload = {
    from: config.twilio.from,
    to: `whatsapp:${to.replace(/\D/g, '')}`,
    body: message
  };

  try {
    const result = await client.messages.create(payload);
    console.log('[TWILIO WHATSAPP] Mensaje enviado', result.sid);
  } catch (err) {
    console.error('[TWILIO WHATSAPP ERROR]', err);
    throw err;
  }
}
