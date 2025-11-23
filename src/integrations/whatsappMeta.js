import { config } from "../config.js";

// TEMPLATE:
// 1 = Nombre
// 2 = Vehiculo

export async function sendWhatsAppMeta(telefono, nombre, vehiculo) {
    try {
        const url = `https://graph.facebook.com/v19.0/${config.whatsappPhoneId}/messages`;

        const body = {
            messaging_product: "whatsapp",
            to: telefono,
            type: "template",
            template: {
                name: "financiacion_saludo",
                language: { code: "es_AR" },
                components: [
                    {
                        type: "body",
                        parameters: [
                            { type: "text", text: nombre },
                            { type: "text", text: vehiculo }
                        ]
                    }
                ]
            }
        };

        // 🔹 MODO PRUEBA — NO ENVÍA MENSAJE
        if (config.whatsapp.dryRun) {
            console.log("DRY RUN – mensaje NO enviado:", {
                telefono,
                nombre,
                vehiculo,
                body
            });
            return { ok: true, dryRun: true };
        }

        // 🔹 ENVÍO REAL
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${config.whatsappToken}`,
            },
            body: JSON.stringify(body)
        });

        const json = await res.json();

        if (!res.ok) {
            console.error("Error WhatsApp:", json);
            throw new Error("Error enviando mensaje de WhatsApp");
        }

        console.log("Mensaje enviado con éxito:", json);
        return json;

    } catch (error) {
        console.error("Fallo en WhatsApp:", error);
        throw error;
    }
}

