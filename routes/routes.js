const express = require('express');
const transactionRouter = express.Router();
const transactionService = require('./../services/transactionService.js');

transactionRouter.get('/', transactionService.period);
transactionRouter.delete('/', transactionService.remove);

module.exports = transactionRouter;
