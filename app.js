"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const axios = require('axios');

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.get('/', function(req, resp) {
    document.write('Hello, this is pedro bot home page.');
});

app.post('/new-message', function(req, res) {
    const { message } = req.body;

    if (!message || message.text.toLowerCase().indexOf('pedro') < 0) {
        return res.end();
    }

    axios
        .post(
            'https://api.telegram.org/[PEDRO_BOT_API_KEY]/sendMessage', 
            {
                chat_id: message.chat.id,
                text: 'Hola, Soy Pedro'
            }
        )
        .then(response => {
            console.log('Message posted : ', response);
            res.end('ok');
        })
        .catch(err => {
            console.log('Error : ' + err);
            res.end('Error : ' + err);
        });
});

app.listen(3000, function() {
    console.log("Pedro bot's listening on port 3000!");
});