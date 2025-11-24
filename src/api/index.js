import express from 'express';
import cors from 'cors';
import { json } from 'express';
import { z } from 'zod';
import { config } from '../config.js';
import { initDb, saveSolicitud } from '../utils/db.js';
import { sendWhatsAppMeta } from '../integrations/whatsappMeta.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { SolicitudSchema } from "../schemas/solicitud.schema.js";
import jwt from 'jsonwebtoken';
import { listSolicitudes, updateSolicitudEstado } from '../utils/db.js';

const app = express();
app.use(cors());
app.use(json());

// Obtener ruta real del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Servir archivos estáticos desde /src/frontend
const FRONTEND_PATH = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_PATH));

// Servir explícitamente la carpeta de categorías
app.use('/categorias', express.static(path.join(__dirname, '..', 'frontend', 'categorias')));

function authAdmin(req, res, next) {
  let token = null;

  // Soportar Authorization: Bearer y token por query (para export CSV)
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const payload = jwt.verify(token, config.admin.jwtSecret);
    req.admin = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}


// 📌 Ruta raíz → cargar index.html
app.get('/', (_req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
});

// healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/admin/api/login', (req, res) => {
  const { user, pass } = req.body || {};

  if (user !== config.admin.user || pass !== config.admin.password) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { user },
    config.admin.jwtSecret,
    { expiresIn: '8h' }
  );

  res.json({ token });
});


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
    const id = await saveSolicitud({
      ...data,
      origen: req.query.origen || "landing",   // si querés permitir tracking
      ip: req.headers["x-forwarded-for"] || req.ip,
      user_agent: req.headers["user-agent"]
    });

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

app.get('/admin/api/solicitudes', authAdmin, async (req, res) => {
  try {
    const {
      search = '',
      estado = '',
      vehiculo = '',
      page = '1',
      pageSize = '50',
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const sizeNum = Math.min(Math.max(parseInt(pageSize, 10) || 50, 1), 200);

    const offset = (pageNum - 1) * sizeNum;

    const solicitudes = await listSolicitudes({
      search: search || undefined,
      estado: estado || undefined,
      vehiculo: vehiculo || undefined,
      limit: sizeNum,
      offset,
    });

    res.json({ data: solicitudes, page: pageNum, pageSize: sizeNum });
  } catch (e) {
    console.error('Error listando solicitudes admin:', e);
    res.status(500).json({ error: 'Error interno' });
  }
});

app.patch('/admin/api/solicitudes/:id/estado', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body || {};

    const estadosValidos = ['enviado', 'nuevo', 'contactado', 'rechazado', 'aprobado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const updated = await updateSolicitudEstado(id, estado);
    if (!updated) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.json({ ok: true, id: updated.id, estado: updated.estado });
  } catch (e) {
    console.error('Error actualizando estado:', e);
    res.status(500).json({ error: 'Error interno' });
  }
});

app.get('/admin/api/solicitudes/export', authAdmin, async (req, res) => {
  try {
    const solicitudes = await listSolicitudes({
      search: req.query.search || undefined,
      estado: req.query.estado || undefined,
      vehiculo: req.query.vehiculo || undefined,
      limit: 1000,
      offset: 0,
    });

    const header = [
      'id',
      'nombre',
      'telefono',
      'dni',
      'vehiculo',
      'precio',
      'estado',
      'origen',
      'ip',
      'user_agent',
      'created_at'
    ];

    const rows = solicitudes.map(s => [
      s.id,
      s.nombre,
      s.telefono,
      s.dni,
      s.vehiculo,
      s.precio ?? '',
      s.estado,
      s.origen ?? '',
      s.ip ?? '',
      (s.user_agent || '').replace(/"/g, "'"),
      s.created_at.toISOString(),
    ]);

    const csvLines = [
      header.join(','),
      ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')),
    ];

    const csv = csvLines.join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="solicitudes.csv"');
    res.send(csv);
  } catch (e) {
    console.error('Error exportando CSV:', e);
    res.status(500).json({ error: 'Error interno' });
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
