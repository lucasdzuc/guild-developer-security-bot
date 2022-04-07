// import express from 'express';
const express = require('express');

const ComplaintController = require('./constrollers/ComplaintController');

// const ComplaintController = require('./constrollers/ComplaintController');

const routes = express.Router();

//ROUTES COMPLAINT
routes.get('/complaint', ComplaintController.index);
routes.post('/complaint', ComplaintController.create);
// routes.update('/complaint/:id', ComplaintController.update);

module.exports = routes;