import {default as fs } from "node:fs";   
const fsP = fs.promises;

import sendMessage from "./send_message.js";



export default function processMessage (event, res) {
  // check user previousky stored action to determine
  // how to respond to user messages
  const response = {
    "text": "you are interacting with Qbot Qsub virtual assistant"
  };
  sendMessage(event.sender.id, response);
};


