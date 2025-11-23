import { z } from "zod";

export const SolicitudSchema = z.object({
  nombre: z.string()
    .min(2, "El nombre es demasiado corto")
    .max(80, "El nombre es demasiado largo"),

  telefono: z.string()
    .regex(/^54\d{10,12}$/, "Número inválido (debe empezar con 54 y tener entre 10 y 12 dígitos)"),

  dni: z.string()
    .regex(/^\d{7,9}$/, "El DNI debe tener entre 7 y 9 números"),

  vehiculo: z.string().min(1, "Falta seleccionar un vehículo"),

  precio: z.number()
    .int()
    .min(0)
    .optional(),

  consentimiento: z.boolean()
});
