import pg from 'pg';
import { config } from '../config.js';
import { encrypt, decrypt } from './security.js'; // 👈 agregamos decrypt

const pool = new pg.Pool({ connectionString: config.dbUrl });

export async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;

      CREATE TABLE IF NOT EXISTS solicitudes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre TEXT NOT NULL,
        telefono TEXT NOT NULL,
        dni TEXT NOT NULL,
        vehiculo TEXT NOT NULL,
        precio NUMERIC,
        consentimiento JSONB NOT NULL,
        estado TEXT DEFAULT 'enviado',
        origen TEXT,
        ip TEXT,
        user_agent TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE INDEX IF NOT EXISTS idx_solicitudes_created_at ON solicitudes (created_at);
      CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes (estado);
      CREATE INDEX IF NOT EXISTS idx_solicitudes_vehiculo ON solicitudes (vehiculo);
    `);
  } finally {
    client.release();
  }
}

export async function saveSolicitud({ 
  nombre, telefono, dni, vehiculo, precio, consentimiento, origen, ip, user_agent 
}) {
  const encTel = encrypt(String(telefono));
  const encDni = encrypt(String(dni));
  const q = `
    INSERT INTO solicitudes (
      nombre, telefono, dni, vehiculo, precio, consentimiento, origen, ip, user_agent
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING id
  `;
  const vals = [
    nombre,
    encTel,
    encDni,
    vehiculo,
    precio ?? null,
    { accepted: !!consentimiento },
    origen ?? null,
    ip ?? null,
    user_agent ?? null
  ];
  const { rows } = await pool.query(q, vals);
  return rows[0].id;
}

// 🔎 Listar solicitudes para el panel admin
export async function listSolicitudes({ search, estado, vehiculo, limit = 50, offset = 0 }) {
  const where = [];
  const vals = [];
  let i = 1;

  if (search) {
    where.push(`(nombre ILIKE $${i} OR vehiculo ILIKE $${i})`);
    vals.push(`%${search}%`);
    i++;
  }

  if (estado) {
    where.push(`estado = $${i}`);
    vals.push(estado);
    i++;
  }

  if (vehiculo) {
    where.push(`vehiculo = $${i}`);
    vals.push(vehiculo);
    i++;
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  vals.push(limit);
  vals.push(offset);
  const limitIndex = i;
  const offsetIndex = i + 1;

  const q = `
    SELECT *
    FROM solicitudes
    ${whereSql}
    ORDER BY created_at DESC
    LIMIT $${limitIndex} OFFSET $${offsetIndex}
  `;

  const { rows } = await pool.query(q, vals);

  return rows.map(row => ({
    id: row.id,
    nombre: row.nombre,
    telefono: decrypt(row.telefono),
    dni: decrypt(row.dni),
    vehiculo: row.vehiculo,
    precio: row.precio,
    estado: row.estado,
    origen: row.origen,
    ip: row.ip,
    user_agent: row.user_agent,
    created_at: row.created_at,
  }));
}

// Cambiar estado de una solicitud
export async function updateSolicitudEstado(id, nuevoEstado) {
  const q = `
    UPDATE solicitudes
    SET estado = $1
    WHERE id = $2
    RETURNING id, estado
  `;
  const { rows } = await pool.query(q, [nuevoEstado, id]);
  return rows[0] || null;
}
