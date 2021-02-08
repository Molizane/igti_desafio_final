const express = require('express');
const transactionRouter = express.Router();
const transactionService = require('./../services/transactionService.js');

transactionRouter.post('/', transactionService.include);
transactionRouter.put('/', transactionService.update);
transactionRouter.patch('/', transactionService.update);
transactionRouter.get('/', transactionService.period);
transactionRouter.delete('/', transactionService.remove);

module.exports = transactionRouter;
