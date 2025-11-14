import express from 'express';
import cors from 'cors';
import { json } from 'express';
import { z } from 'zod';
import { config } from '../config.js';
import { initDb, saveSolicitud } from '../utils/db.js';
import { sendWhatsApp } from '../integrations/whatsapp.js';
import { getMpLink } from '../integrations/mercadoPago.js';
import path from 'path';
import { fileURLToPath } from 'url';
import express from "express";
import axios from "axios";

const app = express();
app.use(cors());
app.use(json());

// configuración de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// servir frontend estático
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }));

// schema de validación
const schema = z.object({
  nombre: z.string().min(2),
  telefono: z.string().min(6),
  dni: z.string().min(6),
  vehiculo: z.string().min(1),
  precio: z.number().positive(),
  consentimiento: z.boolean()
});

// endpoint principal
app.post('/api/solicitar-financiacion', async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: parsed.error.flatten() });
  }

  const data = parsed.data;

  if (!data.consentimiento) {
    return res.status(400).json({ error: 'Debe aceptar términos y condiciones' });
  }

  try {
    // Guardar solicitud en la base de datos
    const id = await saveSolicitud(data);

    // Generar link de Mercado Pago
    const mpLink = getMpLink({
      vehiculo: data.vehiculo,
      precio: data.precio,
      nombre: data.nombre
    });

    // 💬 Mensaje profesional con ambas opciones de pago
    const mensaje = `
Hola ${data.nombre} 👋
Ya vimos tu interés en la ${data.vehiculo}. 🏍️
Precio estimado: *$${data.precio.toLocaleString()}*

Estamos analizando el mejor financiamiento adaptado a tu perfil ✅

En breve seras contactado por un asesor ⏳

Gracias por elegirnos, estamos para ayudarte 🙌

*¿Como te gustaria ser contactado?*

*(“Por Mensaje”)*
*(“Por Llamada”)*
`;

    // Enviar mensaje por WhatsApp
    await sendWhatsApp(data.telefono, mensaje);

    // Respuesta al frontend
    res.json({ ok: true, solicitudId: id });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno', detalle: e?.message || e });
  }
});

// iniciar servidor
async function start() {
  await initDb();
  app.listen(config.port, () => {
    console.log(`MVP escuchando en http://localhost:${config.port}`);
  });
}

start().catch(err => {
  console.error('Fallo al iniciar:', err);
  process.exit(1);
});

const router = express.Router();

// ENVÍA MENSAJE WHATSAPP
router.post("/send-whatsapp", async (req, res) => {
    try {
        const token = "TU_TOKEN_AQUÍ"; 
        const phoneNumberId = "897550086768330"; // el número de prueba que da Meta

        const response = await axios.post(
            `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
            {
                messaging_product: "whatsapp",
                to: "5492954528165",
                type: "template",
                template: {
                    name: "hello_world",
                    language: { code: "en_US" }
                }
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({
            ok: true,
            meta: response.data
        });

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({
            ok: false,
            error: error.response?.data || error.message
        });
    }
});

export default router;