const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
const TransactionModel = require('../models/TransactionModel');

exports.period = async (req, res) => {
  try {
    const yearMonth = req.query.period;

    if (!yearMonth) {
      res
        .status(400)
        .send({ error: 'É necessário informar o parâmetro "period", cujo valor deve estar no formato yyyy-mm' });
      return;
    }

    let [year, month] = yearMonth.split('-');

    year = parseInt(year);
    month = parseInt(month);

    if (!year || year < 2019 || year > 2021 || !month || month < 1 || month > 12) {
      res.status(400).send({ error: 'Erro de parâmetros' });
      return;
    }

    let transactions = await TransactionModel.find({ yearMonth });
    transactions = { length: transactions.length, transactions };

    res.send(transactions);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      res.status(400).send({ error: 'É necessário informar o parâmetro "id"' });
      return;
    }

    const transaction = await TransactionModel.findByIdAndRemove({ _id: id });

    if (!transaction) {
      res.status(404).send({ erro: 'Transação não encontrada.' });
    } else {
      res.send({ status: 'Ok' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
