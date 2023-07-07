// message responses
import {default as fs } from "node:fs";   
const fsP = fs.promises;

import CyclicDb from "@cyclic.sh/dynamodb";

const db = CyclicDb(process.env.DATABASE);

import emailValidator from "email-validator";

import sendMessage from "./send_message.js";

import { sendNewConversationResponse } from "./postback_responses.js";

import sendTemplate from "./send_templates.js";

import { responseServices } from "./templates.js";

import { 
  noTransactFound,
  validateNumber,
  confirmDataPurchaseResponse,
  confirmAirtimePurchaseResponse,
  validateAmount,
} from "./helper_functions.js";




         

// function to respond to unexpected message
export async function defaultMessageHandler (event) {
  const senderId = event.sender.id;
  const usersAction = db.collection(process.env.COLLECTION1);
  
  let {props: email} = usersAction.get(senderId);

  if (email) {
    await sendMessage(senderId, {text: "Hy what can i do for you"})
    sendTemplate(senderId, responseServices);
  } else {
    sendNewConversationResponse(event);
  };
}; //


// function to handle first email
export async function sendEmailEnteredResponse(event) {
  const usersAction = db.collection(process.env.COLLECTION1);
  
  const email = event.message.text;
  const senderId = event.sender.id;
  
  if ( emailValidator.validate(email) ) {
    // updatimg database
    await usersAction.set(senderId,{
      email: email,
      nextAction: null,
    });
    
    const response = {
      text: "email saved \nYou can change email when ever you want"
    };
    await sendMessage(senderId, response);
    
    await sendMessage(senderId, { text: "below are list of services i can offer"});
    sendTemplate(senderId, responseServices);
  } else {
    const response = {
      text: "the email format you entered is invalid \nPlease enter a valid email."
    };
    await sendMessage(senderId, response);
  };
}; // end of sendEmailEnteredResponse





//==================================================
// airtime purchase response function


// function to handle airtime amount entred
export async function sendAirtimeAmountReceived (event) {
  const senderId = event.sender.id;
  const amount = event.message.text.trim();
  const usersAction = db.collection(process.env.COLLECTION1);
  //console.log("number validation", await validateAmount(amount));
  
  if (await validateAmount(amount)) {
    await sendMessage(senderId, {text: "Amount recieved"});
    await usersAction.UpdateItem(senderId, {
      nextAction: "phoneNumber",
      purchasePayload: {
        productName: "okk",
        price: amount
      },
    });
    
    await sendMessage(senderId, {text: "Enter phone number for airtime purchase. \nEnter Q to cancel"});
    return null;
  };
  
  await sendMessage(senderId, { text: "Invalid amount entered \nPlease enter a valid amount. \nEnter Q to cancel" });
}; // end of sendAirtimeAmountReceived


// function to handle phone number entred
export async function sendPhoneNumberEnteredResponses (event) {
  const senderId = event.sender.id;
  const phoneNumber = event.message.text.trim(); 
  const usersAction = db.collection(process.env.COLLECTION1);
  
  const validatedNum = validateNumber(phoneNumber);
  
  if (validatedNum) {
    await sendMessage(senderId, {text: "phone  number recieved"});
    await usersAction.update(senderId, {
      nextAction: null,
      phoneNumber: phoneNumber,
    });
    await confirmDataPurchaseResponse(senderId);  
    return null;
  };
  await sendMessage(senderId, { text: "Phone number not valid. \nPlease enter a valid phone number. \nEnter Q to cancel." });
}; // end of sendPhoneNumberEnteredResponses


// function to handle change of email before transaction
export async function newEmailBeforeTransactResponse (event, transactionType) {
  const usersAction = db.collection(process.env.COLLECTION1);
  const email = event.message.text;
  const senderId = event.sender.id;
  const props =  await usersAction.get(senderId).props;
  
  if (!props.purchasePayload) return noTransactFound(senderId);
  
  if ( emailValidator.validate(email) ) {
    // updating database 
    await usersAction.UpdateItem(senderId, {
      email: email,
      nextAction: null,  
    });

    await sendMessage(senderId, {text: "Email changed successfully."});
    // peform next action dependent on trasactionType
    if (transactionType === "data") {
      await confirmDataPurchaseResponse(senderId);
    } else if (transactionType === "airtime") {
      confirmAirtimePurchaseResponse(senderId);
    };
  } else {
    const response = {
      text: "the email format you entered is invalid. \nPlease enter a valid email. \nEnter Q to cancel."
    };
    await sendMessage(senderId, response);
  };
}; // end of newEmailBeforeTransactResponse 


// function to handle change of phoneNumber
export async function newPhoneNumberBeforeTransactResponse (event, transactionType) {
  const usersAction = db.collection(process.env.COLLECTION1);
  const phoneNumber = event.message.text;
  const senderId = event.sender.id;
  const props = await usersAction.get(senderId).props;
  
  if (!props.purchasePayload) return noTransactFound(senderId);
  
  if ( validateNumber(phoneNumber) ) {
    // updating database
    usersAction.UpdateItem(senderId, {
      phoneNumber: phoneNumber,
      nextAction: null,
    });
    
    await sendMessage(senderId, {text: "Phone number changed successfully"});
    // peform next action dependent on trasactionType
    if (transactionType === "data") {
      await confirmDataPurchaseResponse(senderId);
    } else if (transactionType === "airtime") {
      confirmDataPurchaseResponse(senderId);
    };
  } else {
    const response = {text: "The phone number you entered is invalid. \nPlease enter a valid phone number. \nEnter Q to cancel."};
    await sendMessage(senderId, response);
  };
}; // end of newPhoneNumberBeforeTransactResponse