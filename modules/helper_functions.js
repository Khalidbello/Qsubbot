import {default as fs } from "node:fs";   
const fsP = fs.promises;
import sendMessage from "./send_message.js";
import sendTemplate from "./send_templates.js"
import { 
  confrimDataPurchaseButton1,
  confrimDataPurchaseButton2,
  responseServices
} from "./templates.js";



// function read usersAction
export async function readUsersAction () {
  let usersAction = await fsP.readFile("files/user_next_action.json");
  usersAction = JSON.parse(usersAction);
  return usersAction;
};  // end of readUsersAction



// function to write usersAction
export async function writeUsersAction (obj) {
  let usersAction = JSON.stringify(obj);
  await fsP.writeFile("files/user_next_action.json", usersAction);  
}; // end of readUsersAction




// function to respond to cases when no purchase payload is found for a transact
export async function noTransactFound (senderId) {
  await sendMessage(senderId, {text: "No transaction found \nInitiate new transaction"});
  await sendTemplate(senderId, responseServices);
}; // end of noFransactFound



export function validateNumber(phoneNumber) {
  const prefixes = {
    MTN: ["0803", "0913", "0806", "0703", "0706", "0813", "0816", "0810", "0814", "0903", "0906"],
    Airtel: ["0802", "0808", "0708", "0812", "0902", "0907"],
    Glo: ["0805", "0811", "0915", "0705", "0905", "0807"],
    "9mobile": ["0809", "0817", "0818", "0909"],
  };

  const cleanedNumber = phoneNumber.replace(/\s/g, "").replace("+234", "0"); // Cleaning phone number format

  if (cleanedNumber.length !== 11 || !/^\d+$/.test(cleanedNumber)) {
    return false; // Invalid number length or contains non-digit characters
  };

  const prefix = cleanedNumber.slice(0, 4);

  for (const [network, networkPrefixes] of Object.entries(prefixes)) {
    if (networkPrefixes.includes(prefix)) {
      return true;
    };
  };
  return false; // Number does nrot match any network provider prefix
}; // end of validateNumbe4



// function to form product response
export async function confirmDataPurchaseResponse (senderId) {
  let usersAction = await readUsersAction();
  //console.log(usersAction);
  const purchasePayload =  usersAction[senderId]["purchasePayload"];
  const message1 = {
  "text"  : "Product: " + purchasePayload.productName 
    + "\nNetwork: " + purchasePayload.network
    + "\nPrice: " + purchasePayload.price 
    + "\nPhone Number: " + usersAction[senderId]["phoneNumber"]
    + "\nEmail: " + usersAction[senderId]["email"]
  };
  await sendMessage(senderId, message1)
  await  sendTemplate(senderId, confrimDataPurchaseButton1);
  await  sendTemplate(senderId, confrimDataPurchaseButton2);
  return null;
}; // confirmPurchaseTemplate



// function to confirm airtime purchase
export async function confirmAirtimePurchaseResponse (senderId) {
  let usersAction = await readUsersAction();
  //console.log(usersAction);
  const purchasePayload =  usersAction[senderId]["purchasePayload"];
  const message1 = {
  "text"  : "Product: " + purchasePayload.productName 
    + "\nNetwork: " + purchasePayload.network
    + "\nAmount: " + purchasePayload.price 
    + "\nPhone Number: " + usersAction[senderId]["phoneNumber"]
  };
  await sendMessage(senderId, message1)

  const message2 = {
    "text": "receipt of transaction would be sent to " + usersAction[senderId]["email"] + 
      "\nclick change email button if you wish to change email"
  };
  await sendMessage(senderId, message2);
  await  sendTemplate(senderId, confrimDataPurchaseButton1);
  await  sendTemplate(senderId, confrimDataPurchaseButton2);
}; // end of confirmAirtimePurchaseResponse



// function to validate airtime amount
export async function validateAmount(amount) {
  // Remove any leading or trailing spaces
  amount = amount.trim();

  // Check if the amount is a valid number
  if (isNaN(amount)) {
    return false;
  };
  // Convert the amount to a floating-point number
  const parsedAmount = parseFloat(amount);
  
  // Check if the amount is greater than zero
  if (parsedAmount <= 0) {
    return false;
  };
  // Check if the amount has more than 2 decimal places
  const decimalCount = (parsedAmount.toString().split('.')[1] || '').length;
  if (decimalCount > 2) {
    return false;
  };
  // Validation passed
  return true;
}; // end of validateAmount



// functiont to format date to Nigeria time
export function dateFormatter (date) {
  const date0 = new Date(date);
  // Create an Intl.DateTimeFormat object with the Nigeria time zone
  const nigeriaFormatter = new Intl.DateTimeFormat('en-NG', {
    timeZone: 'Africa/Lagos',
    dateStyle: 'long',
    timeStyle: 'medium',
  }); 
  // Format the Nigeria time using the formatter
  return nigeriaFormatter.format(date0);
}; // end of dateFormatter



// function to create tx_ref
export function txCode() {
  let code = "";
  let characters = "1234567890ABCDEFGHIJKLMNOPQRSTUV";
  for (let x = 0; x < 25; x++) {
     code += characters.charAt( Math.floor( Math.random() *
      characters.length ));
  console.log(characters.length)
  };
  return code + Date.now();
}; // end of txCode