import {default as fs } from "node:fs";   
const fsP = fs.promises;

import sendMessage from "./send_message.js";
import { responseServices } from "./templates.js";
import sendTemplate from "./send_templates.js";
import { sendNewConversationResponse, cancelTransaction } from "./postback_responses.js";

import {
  readUsersAction,
  writeUsersAction,
} from "./helper_functions.js";

import {
  sendEmailEnteredResponse,
  sendPhoneNumberEnteredResponses,
  newEmailBeforeTransactResponse,
  newPhoneNumberBeforeTransactResponse,
  sendAirtimeAmountReceived,
  defaultMessageHandler,
} from "./message_responses.js";






export default async function processMessage (event, res) {
  // check user previousky stored action to determine
  // how to respond to user messages
  const senderId = event.sender.id;
  
  let usersAction = await readUsersAction();
  
  //  checking if it's a new user
  if (!usersAction[senderId]) {
    console.log("new user");
    return sendNewConversationResponse(event);
  };
  
  // check if its a cancel request
  if (event.message.text.toLowerCase() === "q") return cancelTransaction(event);
  
  const nextAction = usersAction[senderId]["nextAction"];
  console.log(nextAction);
  let transactionType; 
  try { 
    transactionType = usersAction[senderId]["purchasePayload"]["type"]; 
  } catch (err) { 
    console.log("no transactionType")
  };


  switch (nextAction) {
    case "toEnterEmail":
      sendEmailEnteredResponse(event);
      break;
    case "phoneNumber":
      sendPhoneNumberEnteredResponses(event)
      break;
    case "enterAirtimeAmount":
      sendAirtimeAmountReceived(event, transactionType);
      break;
    case "changeEmailBeforeTransact":
      newEmailBeforeTransactResponse(event, transactionType);
      break;
    case "changePhoneNumberBeforeTransact":
      newPhoneNumberBeforeTransactResponse(event, transactionType);
      break;
    default: 
      await sendMessage(senderId, {text: "Hy what can i do for you"})
      sendTemplate(senderId, responseServices);
  };
}; // end 