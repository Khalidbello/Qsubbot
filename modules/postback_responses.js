/*import {default as fs } from "node:fs";   
const fsP = fs.promises;*/
import CyclicDb from "@cyclic.sh/dynamodb";

const db = CyclicDb(process.env.DATABASE); 

import sendMessage from "./send_message.js";

import sendTemplate from "./send_templates.js";

import getUsername from "./get_username.js";

import axios from "axios";

import { 
  dateFormatter,
  noTransactFound,
} from "./helper_functions.js";

import 
  { 
    responseServices,
    dataNetworks1, 
    dataNetworks2,
    mtnOffers1,
    nineMobileOffers1,
    gloOffers1,
    airtelOffers1,
    airtimeNetworks1,
    airtimeNetworks2,
} from "./templates.js";



// function to response to newConversations
export async function sendNewConversationResponse (event) {
  const senderId = event.sender.id;
  //const userName = await getUsername(senderId);
  
  const usersAction = db.collection(process.env.COLLECTION1);
  
  await usersAction.set(senderId, {
    nextAction: "toEnterEmail",
    firstTime: true,
  });
  
  let response = {
    "text": `Hy 9 am SubBot. \nBotSub virtual assitance.`
  };
  await sendMessage(senderId, response);
  
  response = {
    text: "Please kindly enter your email."
  };
  await sendMessage(senderId, response); 
  
  let message = "You will recieve your transaction receipts through your email.";
  response = { text: message };
  await sendMessage(senderId, response); 

  response =  { text: "You can change the email when ever you want." };
  sendMessage(senderId, response); 

  console.log("end of new conversation")
}; // end of newConversationResponse




// function to respond when buy data button is clicked 
export async function sendPurchaseDataReponse(event) {
  const senderId = event.sender.id;
  const message1 = {
    text: "Select network for data purchase"
  };
  
  await sendMessage(senderId, message1);
  await sendTemplate(senderId, dataNetworks1);
  await sendTemplate(senderId, dataNetworks2);
}; // end of data purchaseResponse



// function to send mtn offers
export async function sendMtnOffers (event) {
  const senderId = event.sender.id;
  const message = {
    text: "Select MTN data offer"
  };

  await sendMessage(senderId, message);
  await sendTemplate(senderId, mtnOffers1);
};  // end sendMtnOffers



// function to send airtel offers 
export async function sendAirtelOffers (event) {
  const senderId = event.sender.id;
  const message = {
    text: "Select Airtel data offer"
  };

  await sendMessage(senderId, message);
  await sendTemplate(senderId, airtelOffers1);
};  // end sendAirtelOffers



// function to send glo offers
export async function sendGloOffers (event) {
  const senderId = event.sender.id;
  const message = {
    text: "Select Glo data offer"
  };

  await sendMessage(senderId, message);
  await sendTemplate(senderId, gloOffers1);
};  // end sendGloOffers





// functiin to send 9mobile offers
export async function sendNineMobileOffers (event) {
  const senderId = event.sender.id;
  const message = {
    text: "Select 9mobile data offer"
  };

  await sendMessage(senderId, message);
  await sendTemplate(senderId, nineMobileOffers1);
};  // end sendNineMobileOffers



// function to respond when an offer is selected
export async function offerSelected(event, payload) {
  const senderId = event.sender.id;
  const usersAction = db(process.env.COLLECTION1);
  const message = {
    text: "Enter phone number to deliver value to"
  };

  const props = await usersAction.get(senderId).props;
  await usersAction.UpdateItem(senderId, {
    nextAction: "phoneNumber",
    purchasePayload: payload,
  });
  
  await sendMessage(senderId, message);
}; // end of offerSelected





// ================================================
// section airtime purchase

// function to respond to purchaseAirtime
export async function sendPurchaseAirtimeResponse(event) {
  const senderId = event.sender.id;
  
  await sendMessage(senderId, {text: "Select network for airtime purchase"});
  await sendTemplate(senderId, airtimeNetworks1);
  await sendTemplate(senderId, airtimeNetworks2);
}; // end of sendPurchaseAirtimeResponse


// function to handdle mtnAirtime
export async function airtimePurchase(event, payload) {
  const senderId = event.sender.id;
  const usersAction = db(process.env.COLLECTION1);
  console.log("in airtime purchase");

  await sendMessage(senderId, {text: `Enter ${payload.network} airtime amount`});
  // updating database
  await usersAction.UpdateItem(senderId, {
    nextAction: "enterAirtimeAmount",
    purchasePayload: payload
  });
}; // end of mtnAirtimePurchase




//===========================[=================]
// issue Report responses

export async function issueReport (event) {
  const senderId = event.sender.id; 
  const usersAction = db(process.env.COLLECTION1);

  await sendMessage(senderId, {text: "Pls enter a detailed explation of your issue" });
  // updating database
  await usersAction.UpdateItem(senderId, {
    nextAction: "enterIssue",
  });
};



//===============================================
// generic responses

// function to generate account number
export async function generateAccountNumber (event) {
  let returnFalse;
  const senderId = event.sender.id;
  const usersAction = db(process.env.COLLECTION1);
  
  const props = await usersAction.get(senderId).props;
  
  if (!props.purchasePayload) return noTransactFound(senderId);

  props.purchasePayload.email = props.email;
  props.purchasePayload.phoneNumber = props.phoneNumber;
  console.log(props.purchasePayload);

  let response = await axios.post(
    `https://${process.env.HOST}/gateway/transfer-account`,
    props.purchasePayload,
  )
  .catch(error => {
    returnFalse = true;
    console.log('Error getting transfer account:', error.r);
  });
  
  if (returnFalse) {
    await sendMessage(senderId, {text: "Ana error occured \nPlease start a new transaction" });
    return await cancelTransaction(event, true);
  };
  
  response = await response.data;
  console.log(response);
  
  if (response.status === "success") {
    const data = response.meta.authorization;
    await sendMessage(senderId, {text: "make transfer to the account below"});
    await sendMessage(senderId, {text: "value would be delivered once purchase is made"});
    await sendMessage(senderId, {text: "Account Name: " + data.transfer_bank});
    await sendMessage(senderId, {text: "Account Number: 👇"});
    await sendMessage(senderId, {text: data.transfer_account})
    await sendMessage(senderId, {text: "Amount: #" + data.transfer_amount});
    await sendMessage(senderId, {text: "Account Expiry: " + dateFormatter(data.account_expiration)});
  } else {
    await sendMessage(senderId, {text: "An error occured \nPlease start a new transaction" });
  };
  // removing purchasePayload
  cancelTransaction(event, end=true);
}; // end of generateAccountNumber






// function to chanege email b4 transaction
export async function changeMailBeforeTransact (event) {
  const senderId = event.sender.id;
  const usersAction = db(process.env.COLLECTION1);
  
  const props =  usersAction.get(senderId).props;
  
  if (!props.purchasePayload) {
    // updating database
    await usersAction.UpdateItem(senderId, {nextAction: null});
    return noTransactFound(senderId);
  };

  await usersAction.UpdateItem(senderId, {nextAction: "changeEmailBeforeTransact"});
  
  sendMessage(senderId, {text: "Enter new email \n\nEnter Q to cancel"});
}; // end of changeMailBeforeTransact





// function to changePhoneNumber 
export async function changePhoneNumber (event) {
  const senderId = event.sender.id;
  const usersAction = db(process.env.COLLECTION1);
  
  const props =  await usersAction.get(senderId).props;
  
  if (!props.purchasePayload) {
    // updatimg database
    await usersAction.UpdateItem(sederId, { nextAction: null });
    return noTransactFound(senderId);
  };

  await usersAction.UpdateItem(sederId, { nextAction: "changePhoneNumberBeforeTransact" });
  
  sendMessage(senderId, {text: "Enter new phone number \n\nEnter Q to cancel"});
}; // end of changeMailBeforeTransact




// function to cancel transaction
export async function cancelTransaction (event, end=false) {
  const senderId = event.sender.id;
   const usersAction = db(process.env.COLLECTION1);

  
  // delete purchase payload here
  
  
  if (end) {
    await sendMessage(senderId, {text: "Transaction Concluded"});
  } else {
   await sendMessage(senderId, {text: "Transaction Cancled"});
  };
  await sendMessage(senderId, {text:  "What do you want to do next"});
  await sendTemplate(senderId, responseServices);
}; // end of cancelTransaction