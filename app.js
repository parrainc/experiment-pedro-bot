"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const axios = require('axios');
const listOfCommands = [
    '/dialgo',
    '/pizza',
    '/relaja',
    '/comparte',
    '/opina',
    '/ataca',
    '/rh'
];

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.get('/', function(req, resp) {
    console.log(`This is Pedro's bot home page`);
    resp.end('nothing to do here');
});

app.post('/new-message', function(req, res) {
    const { message } = req.body;

    if (!message) {
        return res.status(400).end('payload is undefined!');
    }

    if (listOfCommands.includes(message.text.toLowerCase()) < 1) {
        // axios
        //     .post(
        //         `https://api.telegram.org/${process.env.PEDRO_BOT_API_KEY}/sendMessage`,
        //         {
        //             chat_id: message.chat.id,
        //             text: `Uhm... I'm not smart enough to determine what do you mean by that. Try another command :)`
        //         }
        //     )
        //     .then(response => {
        //         console.log('Invalid command : ', response);
        //         res.status(404).end('command not found');
        //         return res.status(404).end('command not found');
        //     })
        //     .catch(err => {
        //         console.log('Error : ' + err);
        //         res.status(500).end('Error : ' + err);
        //         return res.status(404).end('command not found');
        //     });

            return res.status(404).end('command not found');

    } else {
        axios
            .post(
                `https://api.telegram.org/${process.env.PEDRO_BOT_API_KEY}/sendMessage`,
                {
                    chat_id: message.chat.id,
                    text: 'Hey, this is Pedro. ' + message.text
                }
            )
            .then(response => {
                console.log('Message posted : ', response);
                res.status(200).end('ok');
            })
            .catch(err => {
                console.log('Error : ' + err);
                res.status(500).end('Error : ' + err);
            });
    }
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Pedro's bot is listening! Have fun.");
});