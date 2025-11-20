import axios from "axios";

axios.post(
  "https://graph.facebook.com/v24.0/897550086768330/messages",
  {
    messaging_product: "whatsapp",
    to: "542954528165",
    type: "template",
    template: {
      name: "financiacion_saludo",
      language: { code: "es" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: "Marcos" },
            { type: "text", text: "Rouser 200" }
          ]
        }
      ]
    }
  },
  {
    headers: {
      Authorization: "EAAUyO75ogaQBPyWYJSx05IlHn3sEJJgGLvi33qgwmK9RyREb8uCFWOm5jElZAn3ttCBcvtZCZBadjc49WzAPUw2zyO3n0CAGxyurrqTrsKvFqBODR4Lw6ubUWJUIZCNPDTqIxFqr3TkaI5t60Nc7xY8a4fUuMIwZBSaJAEBEh0Gx7FxUfgGcar1J8YtJ8g2XjJLhLNW9jijyhT7ILYucmCVJ8krFAvwvaPJiQ7M4XqFJtUBH3cYwe4ZByniUVQyJNMhcrqKFZAqLy8gJlOSvmZAzBqIMXzQC2mxxvDzpPQZDZD",
      "Content-Type": "application/json"
    }
  }
)
.then(r => console.log(r.data))
.catch(e => console.log(e.response?.data));
