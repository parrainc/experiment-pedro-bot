"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const axios = require('axios');
//const commands = require('./commands');

const interactions = [
    {
        'instruction': 'klk',
        'response': `Dame lu manito. Soy Pedro Bot. Mi username es @pedromonzonbot por si me quieren dar mention. 
        Para hablar conmigo escribe mi nombre y una instruccion. ejemplo: Pedro di algo.
        Algunas de las opciones validas son (descubre las otras): 
        - di algo
        - quieres pizza
        - rh
        - mmg`
    },
    {
        'instruction': 'di algo',
        'response': 'Señores, dejen el relajo'
    }, 
    {
        'instruction': 'quieres pizza',
        'response': 'Deja ver los nutritions facts'
    },
    {
        'instruction': 'rh',
        'response': 'Voy a ir a Recursos Humanos'
    }, 
    {
        'instruction': 'opina',
        'response': 'Tu no sabe lo que me paso ahorita'
    },
    {
        'instruction': 'eres chica',
        'response': 'Sea mas serio'
    },
    {
        'instruction': 'mmg',
        'response': 'Te voy a reportar con Recursos Humanos '
    },
    {
        'instruction': 'ya compramos la pistola',
        'response': 'Me estas amenazando de muerte y diciendo cosas feas'
    },
    {
        'instruction': 'maricon',
        'response': 'Sea mas serio'
    }
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
        return res.end('message is undefined!');
    }
    
    //interact with pedro by custom interactions.
    if (message.text.toLowerCase().startsWith('pedro') 
        || message.text.toLowerCase().startsWith(process.env.PEDRO_BOT_NAME)) {

            const caller = message.text.toLowerCase().startsWith('pedro') ? 'pedro': process.env.PEDRO_BOT_NAME;
            let actualInstruction = message.text.toLowerCase().substr(caller.length).trimLeft();
            let botResponse = interactions.find(interaction => interaction.instruction.includes(actualInstruction));

            console.log('message: ' + JSON.stringify(message));
            console.log('caller: ' + caller);
            console.log('actualInstruction: ' + actualInstruction);
            console.log('botResponse: ' + JSON.stringify(botResponse));

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
                // axios
                //     .post(
                //         `https://api.telegram.org/${process.env.PEDRO_BOT_API_KEY}/sendMessage`, 
                //         {
                //             chat_id: message.chat.id,
                //             text: 'Me dijiste algo mmg?'
                //         }
                //     )
                //     .then(response => {
                //         console.log('Message posted : ', response);
                //         res.status(200).end('ok');
                //     })
                //     .catch(err => {
                //         console.log('Error on posting message : ' + err);
                //         res.status(500).end('Error : ' + err);
                //     });

                console.log('caller: ' + caller);
                console.log('actualInstruction: ' + actualInstruction);
                console.log('botResponse: ' + botResponse);

                return res.status(404).end('instruction not found : ' + actualInstruction);          
            }
    } else {
        return res.status(404).end('neither command nor instruction was found');
    }

    /*
    //interact with pedro by using commands.
    if (listOfCommands.find(content => message.text.toLowerCase().includes(content)) !== undefined) {
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
    */
});

app.post('/reset-count', function(req, res) {
    return 1;
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Pedro's bot is listening! Have fun.");
});