import express from "express";
import morgan from "morgan";
import {router as verifyWebhookRouter} from "./routes/verify_webhook.js";


const app = express();

// app configuration
app.set('port', (process.env.PORT || 3000));

// setup our express application
app.use(morgan('dev')); // log every request to the console
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// locking in routes
app.use("/", verifyWebhookRouter);


// warming up the engines !! setta !! go !!!.
app.listen(app.get('port'), function() {
  //const url = 'http://localhost:' + app.set('port');
  console.log('Application running on port: ', app.get('port'));
});
