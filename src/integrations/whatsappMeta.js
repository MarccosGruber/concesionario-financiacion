import axios from "axios";

export async function sendWhatsAppMeta(numero) {
  try {
    const phoneNumberId = "897550086768330"; // tu número de prueba Meta
    const token = "EAAUyO75ogaQBPwk9SfXhpoklfqILnM30Pu8jOjo2cnZBCwPWReuNE452gCYmZAZCPJQGIDddLc1ZBsnLavUtIZAFfLXDNZAn8znKEkR8zn8euHKIiv0ZB6j788FaFR3tAo6C9ZBoHazUUqYvEjPx5omSZCKGYpixd2dKBqkPMnW6Bb6Ac4P4zjdxDcWfmMNgHngnDIrQR3NMnDjXH96V2migjYJUrS6Eg368SAhrqFpsv5jMuB5J577Ys5jQy7SlQjgZDZD";

    const payload = {
      messaging_product: "whatsapp",
      to: numero,
      type: "template",
      template: {
        name: "hello_world",
        language: { code: "en_US" }
      }
    };

    const response = await axios.post(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("META WHATSAPP: mensaje enviado", response.data);

  } catch (error) {
    console.error(
      "ERROR META:",
      error.response?.data || error.message
    );
    throw error;
  }
}
