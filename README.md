# Concesionario Financiación — MVP (Web + API + WhatsApp)

Este esqueleto implementa:
- Frontend simple (catálogo + formulario)
- Backend Express con endpoint `/api/solicitar-financiacion`
- Guardado en PostgreSQL (crea la tabla si no existe)
- Envío de WhatsApp automático (Twilio) con **DRY RUN** por defecto
- Link de Mercado Pago configurable por `.env`

## Requisitos
- Node.js 18+
- PostgreSQL 13+
- Cuenta Twilio (opcional; en DRY RUN no se envía)

## Uso rápido
```bash
cp .env.example .env
# Edita .env con tu DATABASE_URL, MP_LINK, ENCRYPTION_KEY
npm install
npm start
# Abre http://localhost:3000
```

## Endpoint
`POST /api/solicitar-financiacion`

Payload:
```json
{
  "nombre": "Juan",
  "telefono": "+5491123456789",
  "dni": "40123123",
  "vehiculo": "Yamaha MT03",
  "precio": 3200000,
  "consentimiento": true
}
```

## Variables de entorno clave
- `DATABASE_URL`
- `WHATSAPP_DRY_RUN=true` para NO enviar mensajes reales
- `TWILIO_*` (si vas a enviar mensajes reales)
- `MP_LINK` (URL que se envía al cliente)
- `ENCRYPTION_KEY` (para cifrar DNI/telefono en DB)

## Tabla
Se crea automáticamente:
- `solicitudes(id, nombre, telefono, dni, vehiculo, precio, consentimiento, estado, created_at)`
