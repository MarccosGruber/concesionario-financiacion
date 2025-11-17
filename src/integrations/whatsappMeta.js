import axios from "axios";

export async function sendWhatsAppMeta(telefono, nombre, vehiculo) {
    try {
    const phoneNumberId = "897550086768330"; // tu número de prueba Meta
    const token = "EAAUyO75ogaQBP9ZCFyAByQ63sVSLnpQQ1FXMfaxixcytZAAyQYD0bWiFAQIxSCFYLMZA6GmOFZB8U9MuWFILqKMQk9zbJuasEoJhtMaQb3rIstxJlCeq9OqmtkhNZBPZAH922cx2o9REogbQrTS0gOwAjG3QQy7KBDJ4kQZCcPEDNQErL0MznBIxhoQteg61r7ZArXWZAZCtJi1NkYoLLQ4OiEH27lxuBvL2BG4lgpEmtji0zy9xpSlvyQIuQbI1hKcgZDZD";

    const response = await axios.post(
            `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
            {
                messaging_product: "whatsapp",
                to: telefono,
                type: "template",
                template: {
                    name: "concecionario1",
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
