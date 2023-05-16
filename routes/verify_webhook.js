import processPostback from "./../modules/process_postback.js";
import processMessage from "./../modules/process_messsage.js"

import {Router} from "express";

export const router = Router();

router.get('/fb-hook', function(req, res) {
  console.log(process.env.FB_VERIFY_TOKEN);
  console.log(req.query['hub.verify_token']);
  if (req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN){
    console.log('webhook verified');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('verification failed. Token mismatch.');
    res.sendStatus(403);
  }
}); // end of webhook get req


router.post('/fb-hook', async function (req, res) {
  //checking for page subscription.
  if (req.body.object === 'page'){
    /* Iterate over each entry, there can be multiple entries allbacks are batched. */
    req.body.entry.forEach(function(entry) {
      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        console.log(event);
        let sender_psid = event.sender.id;
        console.log('Sender PSID: ' + sender_psid);
        if (event.postback){
          processPostback(event, res);
        } else if (event.message){
          processMessage(event, res);
        };
      });
    });
    
  };
  res.sendStatus(200);
}); // end of webhook post req