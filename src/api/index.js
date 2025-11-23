import express from 'express';
import cors from 'cors';
import { json } from 'express';
import { z } from 'zod';
import { config } from '../config.js';
import { initDb, saveSolicitud } from '../utils/db.js';
import { sendWhatsAppMeta } from '../integrations/whatsappMeta.js';
import { getMpLink } from '../integrations/mercadoPago.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { SolicitudSchema } from "../schemas/solicitud.schema.js";


const app = express();
app.use(cors());
app.use(json());

// Obtener ruta real del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Servir archivos estáticos desde /src/frontend
const FRONTEND_PATH = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_PATH));

// Servir carpeta frontend completa
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Servir explícitamente la carpeta de categorías
app.use('/categorias', express.static(path.join(__dirname, '..', 'frontend', 'categorias')));

// 📌 Ruta raíz → cargar index.html
app.get('/', (_req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
});

// healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }));

// endpoint principal
app.post('/api/solicitar-financiacion', async (req, res) => {
const parsed = SolicitudSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: parsed.error.flatten()
    });
  }

  const data = parsed.data;

  if (!data.consentimiento) {
    return res.status(400).json({
      error: 'Debe aceptar términos y condiciones'
    });
  }

  try {
    const id = await saveSolicitud(data);

    await sendWhatsAppMeta(
      data.telefono,
      data.nombre,
      data.vehiculo
    );

    res.json({ ok: true, solicitudId: id });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Error interno',
      detalle: e?.message || e
    });
  }
});

async function start() {
  await initDb();
  app.listen(config.port, () =>
    console.log(`MVP escuchando en http://localhost:${config.port}`)
  );
}

start().catch(err => {
  console.error('Fallo al iniciar:', err);
  process.exit(1);
});
