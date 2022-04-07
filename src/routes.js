// import express from 'express';
const express = require('express');

const ComplaintController = require('./constrollers/ComplaintController');

// const ComplaintController = require('./constrollers/ComplaintController');

const routes = express.Router();

//ROUTES COMPLAINT
routes.get('/complaints', ComplaintController.index);
routes.post('/complaints', ComplaintController.create);
// routes.update('/complaint/:id', ComplaintController.update);

module.exports = routes;