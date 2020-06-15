const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const affirmations = [
    "Today you woke up and that is a victory.",
    "You are loved.",
    "Don't forget to extend yourself grace.",
    "You are valuable.",
    "You will survive this.",

]

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

app.post('/api/messages', (req, res) => {
  res.header('Content-Type', 'application/json');
  client.messages
      .create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: req.body.to,
        body: req.body.body
      })
      .then(() => {
        res.send(JSON.stringify({ success: true }));
      })
      .catch(err => {
        console.log(err);
        res.send(JSON.stringify({ success: false }));
      });
});

app.get('/api/messages', (req, res) => {
    res.send(affirmations[Math.floor(Math.random()*affirmations.length)])
        .catch(err => {
            console.log(err);
            res.send(JSON.stringify({ success: false }));
        });
});

app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();

    twiml.message(affirmations[Math.floor(Math.random()*affirmations.length)]);

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
