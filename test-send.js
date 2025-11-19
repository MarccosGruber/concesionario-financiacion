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
      Authorization: "EAAUyO75ogaQBPyNM6jlgOJnvhODaVJrZAnZCTb2ER5aqHZB8UfYmsS99dwtlzrZCmBru0UoXWCYaZCiMOXAEDy7izlbJQJW3ugqQDaKJPFUcMSMXb9X6D42zBfJz3vL0ZCngkVOVRhULETtfM5ErFNiQXY1khvAVwpUHDdPi1ehHtMGaXNJRpl116bVuHuUQkQCq85wskfki6tpKpXZB0JcuTYfFJ8PmJVZCv16LW2KZAy86ZBubZCOL8pD9CLVMJ6d6BSb6TWTcUhPkRX4k89OKLijHqTdJdLmwdLCsEJFDAZDZD",
      "Content-Type": "application/json"
    }
  }
)
.then(r => console.log(r.data))
.catch(e => console.log(e.response?.data));
