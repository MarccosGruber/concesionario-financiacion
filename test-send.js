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
      Authorization: "Bearer EAAUyO75ogaQBP3QEGowLD8L9Nol0sLMOUqSX5WE84ilDdkT6VqjsZAK61oZAehpqv87zWzGyqXcAr0I6Xn9q66efZB8kodPi1T01eAPq7OZAXuQu1g3Xv0UZAibJM9Bk9otiSQsREh1bJspb2YxBlu0CKKsOaKtVQXLt8l7VHfQFQ4FZBPN2BHOeENZABqwYJAAaS6MfZCOgf1GoscUBXkwMimHILCnJ1I3s9IlZBFrNk00SZBGF2ifhS64z5Ufnr36BtLv5IZBIx2nC8jqCAI4MNZCEQXoOFhTWnT4L32UcUDQZD",
      "Content-Type": "application/json"
    }
  }
)
.then(r => console.log(r.data))
.catch(e => console.log(e.response?.data));
