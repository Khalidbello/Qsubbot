export const responseServices = { 
  "attachment":{
    "type":"template",
    "payload":{
      "template_type":"button",
      "text": "Select service you want me to offer",
      "buttons":[
        {
          "type": "postback",
          "title": "Buy Data",
          "payload":"buyData"
        },
        {
          "type": "postback",
          "title": "Buy Data",
          "payload":"buyData"   
        },
      ]
    }
  }
};