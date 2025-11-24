import pg from 'pg';
import { config } from '../config.js';
import { encrypt } from './security.js';

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

      -- Índices recomendados
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

