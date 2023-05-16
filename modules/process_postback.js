import {sendNewConversationResponse} from "./responses.js";



export default async function processPostback (event, res) {
  if (event.postback.payload == "newConversation") {
    sendNewConversationResponse(event);
  }
};  // end of processPostback