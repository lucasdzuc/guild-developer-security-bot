const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();
// const axios = require('axios');
const Telebot = require("telebot");

const { basicAnswer, floodMessage, welcomeMessage, helpMessage, wrongFormat, errorMessage } = require("./messages/messages.js");

const { create } = require('./constrollers/ComplaintController');

const routes = require('./routes');

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 3333;

const corsOptions = {
  origin: '*',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS' ,
  exposedHeaders: [ 'Authorization', 'X-Total-Count', 'X-Requested-With', 'Content-Type', 'x-acess-token' ],
  preflightContinue: false,
};


app.use(cors(corsOptions));

const bot = new Telebot({
  token: process.env.BOT_TOKEN,
  usePlugins: ['floodProtection'],
    pluginConfig: {
      floodProtection: {
        interval: 3,
        message: floodMessage
      }
    }
});

const CHAT_ID = process.env.CHAT_ID_PROFILE;

bot.on(["text"], async (msg) => {
  let text = msg.text;
  let fromId = msg.from.id;
  let messageId = msg.message_id;
  let promise;

  console.log("[text message]:", JSON.stringify(msg));

  // console.log(msg);

  if(text === "/start"){
    return bot.sendMessage(fromId, welcomeMessage);
  } else if (text === "/help") {
    return bot.sendMessage(fromId, helpMessage);
  } else {
    bot.sendMessage(fromId, basicAnswer);
    promise = bot.sendMessage(CHAT_ID, text);

    await create(msg, );
    
    return promise.catch(error => {
      console.log('[error]: ', JSON.stringify(error));
      bot.sendMessage(fromId, errorMessage + JSON.stringify(error));
    });
  }
});

bot.on(["photo"], (msg) => {
  let photo = msg.photo[0].file_id;
  console.log('photoo', photo);
  let fromId = msg.from.id;
  let messageId = msg.message_id;
  let caption = msg.caption;
  let promise;

  console.log("[photo message]: ", JSON.stringify(msg));

  bot.sendMessage(fromId, basicAnswer);

  promise = bot.sendPhoto(CHAT_ID, photo, { caption });
  
  return promise.catch(error => {
    console.log('[error]: ', JSON.stringify(error));
    bot.sendMessage(fromId, errorMessage + JSON.stringify(error));
  });
});

bot.on(["forward"], (msg) => {
  let text = msg.text;
  let fromId = msg.from.id;
  let messageId = msd.message_id;
  let promise;

  console.log("[forward message]: ", JSON.stringify(msg));

  bot.sendMessage(fromId, basicAnswer);

  promise = bot.sendMessage(CHAT_ID, text);

  return promise.catch(error => {
    console.log('[error]: ', JSON.stringify(error));
    bot.sendMessage(fromId, errorMessage + JSON.stringify(error));
  })
});

bot.on(["document", "audio", "animation"], (msg) => {
  let fromId = msg.from.id;

  return bot.sendMessage(fromId, wrongFormat);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

bot.connect();

httpServer.listen(PORT, () => { console.info(`Server running port: ${PORT}`) });