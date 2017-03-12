var express = require('express')
var app = express()
var bunyan = require('bunyan')
var log = bunyan.createLogger({
  name: 'good-morning-bot',
  streams: [
    {
      level: 'info',
      path: './good-morning-bot-logs.log'            // log INFO and above to stdout
    }
  ]
});

app.get('/', function (req, res) {
    log.info('Getting request')
    res.send('Hello World!')
})

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'good_morning_bot_secret') {
    log.info("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    log.info("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          log.info("Webhook received unknown event: ", event);
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

function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  log.info("Message data: ", event.message);
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  log.info("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  log.info(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendGenericMessage(recipientId, messageText) {
  // To be expanded in later sections
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: 'EAAFIIsI0BoQBANDtZASCZC4d6Yy5XRmwE1HbIBBgxOc8c4jk3rpJNZBcYhGPuiaZAbkPVeugHHCI8UukIawDudvw5ystyQfYXO3qHemXizob6p5kKdWkZCm5yJl0R5A8dRm5TQZCCG2FpAS0IVLUxkI2Usgx0bPFASS2dTq1mBAAZDZD' },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      log.info("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      log.info("Unable to send message.");
      log.info(response);
      log.info(error);
    }
  });
}

app.listen(3000, function () {
    log.info('Started good morning')
})
