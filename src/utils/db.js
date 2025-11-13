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
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);
  } finally {
    client.release();
  }
}

export async function saveSolicitud({ nombre, telefono, dni, vehiculo, precio, consentimiento }) {
  const encTel = encrypt(String(telefono));
  const encDni = encrypt(String(dni));
  const q = `INSERT INTO solicitudes (nombre, telefono, dni, vehiculo, precio, consentimiento)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`;
  const vals = [nombre, encTel, encDni, vehiculo, precio ?? null, { accepted: !!consentimiento }];
  const { rows } = await pool.query(q, vals);
  return rows[0].id;
}
