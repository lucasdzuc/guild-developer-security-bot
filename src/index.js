const express = require('express');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');

dotenv.config();

// import express from 'express'
// import cors from 'cors';
// import http from 'http';

const routes = require('./routes');

const app = express();
const httpServer = http.createServer(app);

const corsOptions = {
  origin: '*',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS' ,
  exposedHeaders: [ 'Authorization', 'X-Total-Count', 'X-Requested-With', 'Content-Type', 'x-acess-token' ],
  preflightContinue: false,
};

app.use(cors(corsOptions));

const { basicAnswer, floodMessage, welcomeMessage, helpMessage, wrongFormat, errorMessage } = require("./messages/messages.js");

const Telebot = require("telebot");

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

bot.on(["text"], (msg) => {
  let text = msg.text;
  let fromId = msg.from.id;
  let messageId = msg.message_id;
  let promise;

  console.log("[text message]: ", JSON.stringify(msg));

  if(text === "/start"){
    return bot.sendMessage(fromId, welcomeMessage);
  } else if (text === "/help") {
    return bot.sendMessage(fromId, helpMessage);
  } else {
    bot.sendMessage(fromId, basicAnswer);

    promise = bot.sendMessage(CHAT_ID, text);

    return promise.catch(error => {
      console.log('[error]: ', JSON.stringify(error));
      bot.sendMessage(fromId, errorMessage + JSON.stringify(error));
    })
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

bot.connect();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);
httpServer.listen(3333);