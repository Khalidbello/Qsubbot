export const responseServices = { 
  "type":"template",
  "payload":{
    "template_type":"button",
    "text": "Select request",
    "buttons":[
      {
        "type":"postback",
        "title":"Buy Data",
        "payload": '{"title": "dataPurchase"}'
      }, 
      {
        "type":"postback",
        "title":"Buy Airtime",
        "payload": '{"title": "airtimePurchase"}'
      }, 
      {
        "type":"postback",
        "title":"Report Issue",
        "payload": '{"title": "issueReport"}'
      }, 
    ]
  }
};  // end of responseServices


export const dataNetworks1 = { 
  "type":"template",
  "payload":{
    "template_type":"button",
    "text":"Select Network",
    "buttons":[
      {
        "type":"postback",
        "title":"MTN",
        "payload": '{"title": "mtnOffers"}'
      }, 
      {
        "type":"postback",
        "title":"Airtel",
        "payload": '{"title": "airtelOffers"}'
      },
    ]
  }
}; 

export const dataNetworks2 = {
  "type": "template",
  "payload": {
    "template_type": "button",
    "text": "...",
    "buttons": [
      {
        "type":"postback",
        "title":"9mobile",
        "payload": '{"title": "9mobileOffers"}'
      }, 
      {
        "type": "postback",
        "title": "Glo",
        "payload": '{"title": "gloOffers"}'
      },
    ]
  }
}; // end of dataNetworks


export const mtnOffers1 = {
  "type": "template",
  "payload": {
    "template_type": "button",
    "text": "Select MTN offer",
    "buttons": [
      {
        "type": "postback",
        "title": "1GB   #500   1 month ",
        "payload": `{
          "title": "offerSelected",
          "network": "mtn",
          "networkID": "1",
          "planID": "7",
          "size": "1GB",
          "price": "250",
          "index": "2",
          "type": "data",
          "productName": "1GB Data"
        }`
      }, 
      {
        "type": "postback",
        "title": "2GB   #500   1 month ",
        "payload": `{0lk}`,
      },
      {
        "type": "postback",
        "title": "3GB   #700 th  1 month ",
        "payload": `{
          "title": "offerSelected",
          "networkID": "mtn",
          "planID": "7",
          "size": "1GB",
          "price": "250",
          "index": "2",
          "type": "data",
          "productName": "1GB Data"
        }`
      },
    ]
  }
}; // end of mtnOffers


export const airtelOffers1 = {
  "type": "template",
  "payload": {
    "template_type": "button",
    "text": "Select Airtel offer",
    "buttons": [
      {
        "type":"postback",
        "title":"1GB.....#250.....1..month",
        "payload": `{
          "title": "offerSelected",
          "networkId": "1",
          "planId": "342"
        }`
      }, 
      {
        "type": "postback",
        "title": "2GB   #500   1 month ",
        "payload": '{"title": "offerSelected"}'
      },
      {
        "type": "postback",
        "title": "3GB   #700   1 month ",
        "payload": '{"title": "offerSelected"}'
      },
    ]
  }
}; // end of airtelOffers


export const gloOffers1 = {
  "type": "template",
  "payload": {
    "template_type": "button",
    "text": "Select Glo offer",
    "buttons": [
      {
        "type":"postback",
        "title":"1GB.....#250.....1..month",
        "payload": `{
          "title": "offerSelected",
          "networkId": "1",
          "planId": "342"
        }`
      }, 
      {
        "type": "postback",
        "title": "2GB   #500   1 month ",
        "payload": '{"title": "offerSelected"}'
      },
      {
        "type": "postback",
        "title": "3GB   #700   1 month ",
        "payload": '{"title": "offerSelected"}'
      },
    ]
  }
}; // end of gloOffers


export const nineMobileOffers1 = {
  "type": "template",
  "payload": {
    "template_type": "button",
    "text": "Select MTN offer",
    "buttons": [
      {
        "type":"postback",
        "title":"1GB.....#250.....1..month",
        "payload": `{
          "title": "offerSelected",
          "networkId": "1",
          "planId": "342",
          "productName": "1GB Data",
          "network": "mtn",
          "pricre": "#250"
        }`
      }, 
      {
        "type": "postback",
        "title": "2GB   #500   1 month ",
        "payload": `{
          "title": "offerSelected",
          "networkId": "744",
          "productName": "2GB Data",
          "network": "mtn",
          "price": "#500",
        }`
      },
      {
        "type": "postback",
        "title": "3GB   #700   1 month ",
        "payload": '{"title": "offerSelected"}'
      },
    ]
  }
}; // end of nineMobileOffers



// button for comfirm data purchase
export const confrimDataPurchaseButton1 = {
  "type": "template",
  "payload": {
    "template_type": "button",
    "text": "Select action",
    "buttons": [
      {
        "type":"postback",
        "title":"Make Purchase",
        "payload": `{"title": "generateAccountNumber"}`
      },
      {
        "type": "postback",
        "title": "Change Phone Number",
        "payload": `{"title": "changePhoneNumber"}`
      },
    ]
  }
}; // end of confrimDataPurchaseButton

export const confrimDataPurchaseButton2 = {
  "type": "template",
  "payload": {
    "template_type": "button",
    "text": "...",
    "buttons": [
      {
        "type": "postback",
        "title": "Change email",
        "payload": `{"title": "changeMailBeforeTransact"}`
      },
      {
        "type":"postback",
        "title":"Cancel Transaction",
        "payload": `{"title": "cancel"}`
      },
    ]
  }
}; // end of confrimDataPurchaseButton2





//=================================================
// section for airtime templates


export const airtimeNetworks1 = { 
  "type":"template",
  "payload":{
    "template_type":"button",
    "text":"Select Network",
    "buttons":[
      {
        "type":"postback",
        "title":"MTN",
        'payload': `{
          "title": "enterAirtimeAmount",
          "network": "mtn",
          "networkID": "1",
          "type": "airtime"
        }`
      }, 
      {
        "type":"postback",
        "title":"Airtel",
        'payload': `{
          "title": "enterAirtimeAmount",
          "network": "airtel",
          "networkID": "4",
          "type": "airtime",
        }`
      },
    ]
  }
}; // end of dataNetworks1




export const airtimeNetworks2 = {
  "type": "template",
  "payload": {
    "template_type": "button",
    "text": "...",
    "buttons": [
      {
        "type":"postback",
        "title":"9mobile",
        'payload': `{
          "title": "enterAirtimeAmount",
          "network": "9mobile",
          "networkID": "3",
          "type": "airtime"
        }`
      },
      {
        "type": "postback",
        "title": "Glo",
        'payload': `{
          "title": "enterAirtimeAmount",
          "network": "glo",
          "networkID": "2",
          "type": "airtime"
        }`
      },
    ]
  }
}; // end of dataNetworks2


