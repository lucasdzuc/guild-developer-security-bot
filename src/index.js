const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();
// const axios = require('axios');
const Telebot = require("telebot");

const api = require('./server/api');

const { basicAnswer, floodMessage, welcomeMessage, helpMessage, wrongFormat, errorMessage } = require("./messages/messages.js");

const { create } = require('./constrollers/ComplaintController');

const PORT = process.env.PORT || 3333;

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

app.use(routes);
app.use(express.urlencoded({ extended: false }));



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

  console.log(msg);

  if(text === "/start"){
    return bot.sendMessage(fromId, welcomeMessage);
  } else if (text === "/help") {
    return bot.sendMessage(fromId, helpMessage);
  } else {
    // try {
    //   await api.post('complaints', {request: text}, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Access-Control-Request-Headers': '*',
    //       'api-key': process.env.API_KEY
    //     },
    //   });
    // } catch (error) {
    //     console.log("ERROR POST API:", error);
    //     return;
    // }

    await create(msg, );
    
    bot.sendMessage(fromId, basicAnswer);

    promise = bot.sendMessage(CHAT_ID, text);

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

bot.connect();
app.use(express.json());
httpServer.listen(PORT, () => {
  console.info(`Server running port: ${PORT}`)
});