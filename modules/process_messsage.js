import { default as fs } from "node:fs";
const fsP = fs.promises;

import CyclicDb from "@cyclic.sh/dynamodb";

const db = CyclicDb(process.env.DATABASE);

import sendMessage from "./send_message.js";

import { responseServices } from "./templates.js";

import sendTemplate from "./send_templates.js";

import { sendNewConversationResponse, cancelTransaction } from "./postback_responses.js";

import {
  sendEmailEnteredResponse,
  sendPhoneNumberEnteredResponses,
  newEmailBeforeTransactResponse,
  newPhoneNumberBeforeTransactResponse,
  sendAirtimeAmountReceived,
  defaultMessageHandler,
} from "./message_responses.js";




export default async function processMessage(event, res) {
  // check user previousky stored action to determine
  // how to respond to user messages
  console.log("db nsme env", process.env.DATABASE);
  const senderId = event.sender.id;
  console.log("db db db", db);
  console.log("collection mame", process.env.COLLECTION1);

  const usersAction = await db.collection(process.env.COLLECTION1);

  const user = await usersAction.get(senderId);
  console.log('user cycliv db payload', user);

  if (!user) return sendNewConversationResponse(event);

  // check if its a cancel request
  if (event.message.text.toLowerCase() === "q") return cancelTransaction(event);

  const userAction = await usersAction.get(senderId);
  let transactionType;
  try {
    transactionType = userAction.props.type;
  } catch (err) {
    console.log("no transactionType")
  };

  switch (userAction.props.nextAction) {
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
      await sendMessage(senderId, { text: "Hy what can i do for you" })
      sendTemplate(senderId, responseServices);
  };
}; // end 