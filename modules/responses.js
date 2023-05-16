import sendMessage from "./send_message.js";


export async function sendNewConversationResponse (event) {
  let dummy;
  let response = {
    "text": "Hy am Qbot \nQsub virtual assitance"
  };
  dummy = await sendMessage(event.sender.id, response);
  
  response = {
    text: "please kindly enter your email"
  };
  dummy = await sendMessage(event.sender.id, response); 
  
  let message = "this is where receipts of your transaction "
    + "would be sent to";
  response = { text: message };
  dummy = await sendMessage(event.sender.id, response); 

  response =  { text: "you can change the email when ever you want" };
  sendMessage(event.sender.id, response); 
}; // end of newConversationResponse