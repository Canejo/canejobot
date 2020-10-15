const tmi = require('tmi.js');
import { CHANNEL_NAME, OAUTH_TOKEN, BOT_USERNAME, BLOCKED_WORDS } from './constants.js';


const options = {
    options: {
        debug: true,
    },
    connection: {
        cluster: 'aws',
        reconnect: true,
    },
    identity: {
        username: BOT_USERNAME,
        password: OAUTH_TOKEN, 
    },
    channels: [CHANNEL_NAME],
};

const client = new tmi.client(options);

client.connect();

// client.on('connected', (address, port) => {
//     client.action('canejo', 'Olá, CanejoBOT está observando!');
// });

client.on('chat', (channel, userstate, message, self) => {
    if (self) return;

    if (message.toLowerCase() === `!hello`) {
        client.say(CHANNEL_NAME, `@${userstate.username} peepoHey`);    
    } else if (message.toLowerCase() === `!bttv`) {
        client.say(CHANNEL_NAME, `@${userstate.username} BetterTTV para Chrome: http://bit.ly/BetterTTVChrome PagChomp BetterTTV para Opera / Mozilla Firefox / Safari / Microsoft Edge: http://bit.ly/BetterTTVD Pog Configuração https://imgur.com/a/XSQJtLl PogU`);        
    }    

    checkTwitchChat(userstate, message, channel);
    
});
client.on("whisper", (from, userstate, message, self) => {
    client.whisper(userstate.username, "Olá");
});

function checkTwitchChat (userstate, message, channel) {

    message = message.toLowerCase();
    let shouldSendMessage = false;

    shouldSendMessage = BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()));

    if (shouldSendMessage) {
        // tell user
        client.say(channel, `@${userstate.username}, sorry!  You message was deleted.`);
        // delete message
        client.deletemessage(channel, userstate.id);
    }
};
