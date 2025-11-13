import { config } from '../config.js';

/**
 * getMpLink
 * En esta versión MVP usamos un link fijo configurable por .env (MP_LINK).
 * A futuro, se puede generar un link por vehículo / monto / preferencia.
 */
export function getMpLink({ vehiculo, precio, nombre }) {
  return config.mpLink;
}
