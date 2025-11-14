import axios from "axios";

export async function sendWhatsAppMeta(telefono, nombre, vehiculo) {
    try {
    const phoneNumberId = "897550086768330"; // tu número de prueba Meta
    const token = "EAAUyO75ogaQBPwk9SfXhpoklfqILnM30Pu8jOjo2cnZBCwPWReuNE452gCYmZAZCPJQGIDddLc1ZBsnLavUtIZAFfLXDNZAn8znKEkR8zn8euHKIiv0ZB6j788FaFR3tAo6C9ZBoHazUUqYvEjPx5omSZCKGYpixd2dKBqkPMnW6Bb6Ac4P4zjdxDcWfmMNgHngnDIrQR3NMnDjXH96V2migjYJUrS6Eg368SAhrqFpsv5jMuB5J577Ys5jQy7SlQjgZDZD";

    const response = await axios.post(
            `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
            {
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
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error("ERROR META:", error.response?.data || error);
        throw error;
    }
}
