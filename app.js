"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const axios = require('axios');
const commands = require('./commands')

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
        return res.end('message is undefined!');
    }

    //interact with pedro by using commands.
    if (commands.listOfCommands.find(content => message.text.toLowerCase().includes(content)) !== undefined) {
        axios
            .post(
                `https://api.telegram.org/${process.env.PEDRO_BOT_API_KEY}/sendMessage`, 
                {
                    chat_id: message.chat.id,
                    text: 'Hey, I am Pedro bot :) '
                }
            )
            .then(response => {
                console.log('Message posted : ', response);
                res.status(200).end('ok');
            })
            .catch(err => {
                console.log('Error on posting message : ' + err);
                res.status(500).end('Error : ' + err);
            });

    } 
    
    //interact with pedro by custom interactions.
    if (message.text.toLowerCase().startsWith('pedro') 
        || message.text.toLowerCase().startsWith(process.env.PEDRO_BOT_NAME)) {

            const caller = message.text.toLowerCase().startsWith('pedro') ? 'pedro': process.env.PEDRO_BOT_NAME;
            let actualInstruction = message.text.toLowerCase().substr(caller.length).trimLeft();
            let botResponse = commands.interactions.find(interaction => interaction.instruction.includes(actualInstruction));

            if (botResponse !== undefined) {
                axios
                    .post(
                        `https://api.telegram.org/${process.env.PEDRO_BOT_API_KEY}/sendMessage`, 
                        {
                            chat_id: message.chat.id,
                            text: botResponse.response.toString()
                        }
                    )
                    .then(response => {
                        console.log('Message posted : ', response);
                        res.status(200).end('ok');
                    })
                    .catch(err => {
                        console.log('Error on posting message : ' + err);
                        res.status(500).end('Error : ' + err);
                    });

            } else {
                axios
                    .post(
                        `https://api.telegram.org/${process.env.PEDRO_BOT_API_KEY}/sendMessage`, 
                        {
                            chat_id: message.chat.id,
                            text: 'Me dijiste algo mmg?'
                        }
                    )
                    .then(response => {
                        console.log('Message posted : ', response);
                        res.status(200).end('ok');
                    })
                    .catch(err => {
                        console.log('Error on posting message : ' + err);
                        res.status(500).end('Error : ' + err);
                    });

                return res.status(404).end('command not found : ' + actualInstruction);          
            }
    } 
    else {
        return res.status(404).end('neither command nor instruction was found');
    }
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Pedro's bot is listening! Have fun.");
});