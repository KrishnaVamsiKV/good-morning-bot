import express from 'express';
import bodyParser from 'body-parser';
import request from 'request';
import bunyan from 'bunyan';

const app = express();
const log = bunyan.createLogger({
  name: 'good-morning-bot',
  streams: [
    {
      level: 'info',
      path: './good-morning-bot-logs.log'            // log INFO and above to stdout
    }
  ]
});

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: 'EAAFIIsI0BoQBANDtZASCZC4d6Yy5XRmwE1HbIBBgxOc8c4jk3rpJNZBcYhGPuiaZAbkPVeugHHCI8UukIawDudvw5ystyQfYXO3qHemXizob6p5kKdWkZCm5yJl0R5A8dRm5TQZCCG2FpAS0IVLUxkI2Usgx0bPFASS2dTq1mBAAZDZD' },
    method: 'POST',
    json: messageData
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const recipientId = body.recipient_id;
      const messageId = body.message_id;

      log.info('Successfully sent generic message with id %s to recipient %s',
        messageId, recipientId);
    } else {
      log.info('Unable to send message.');
      log.info(response);
      log.info(error);
    }
  });
}

function sendTextMessage(recipientId, messageText) {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function receivedMessage(event) {
  if (event.message.text !== 'generic') {
    sendTextMessage(event.sender.id, event.message.text);
  }
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === 'good_morning_bot_secret') {
    log.info('Validating webhook');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    log.info('Failed validation. Make sure the validation tokens match.');
    res.sendStatus(403);
  }
});

app.post('/webhook', (req, res) => {
  const data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach((entry) => {
      // Iterate over each messaging event
      entry.messaging.forEach((event) => {
        if (event.message) {
          receivedMessage(event);
        } else {
          log.info('Webhook received unknown event: ', event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

app.listen(3000, () => {
  log.info('Started good morning');
});
