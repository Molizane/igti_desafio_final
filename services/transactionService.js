const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
const TransactionModel = require('../models/TransactionModel');

function formatDates(year, month, day) {
  return {
    yearMonth: `${('0000' + year).slice(-4)}-${('00' + month).slice(-2)}`,
    yearMonthDay: `${('0000' + year).slice(-4)}-${('00' + month).slice(-2)}-${('00' + day).slice(-2)}`,
  };
}

exports.period = async (req, res) => {
  try {
    const yearMonth = req.query.period;

    if (!yearMonth) {
      res.status(400).send({ error: 'É necessário informar o parâmetro "period", cujo valor deve estar no formato yyyy-mm' });
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
    console.log(`GET error: ${err}`);
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

    const transaction = await TransactionModel.findByIdAndRemove(
      { _id: id },
      {
        useFindAndModify: false,
      }
    );

    // if (!transaction) {
    //   res.status(404).send({ erro: 'Transação não encontrada.' });
    // } else {
    //   res.send({ status: 'Ok' });
    // }

    res.send(transaction);
  } catch (err) {
    console.log(`DELETE error: ${err}`);
    res.status(500).send(err);
  }
};

exports.include = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).send({ error: 'Transação não informada.' });
      return;
    }

    const { year, month, day } = req.body;
    const { yearMonth, yearMonthDay } = formatDates(year, month, day);

    //let transaction = { ...req.body, yearMonth, yearMonthDay };

    const transaction = new TransactionModel({ ...req.body, yearMonth, yearMonthDay });
    await transaction.save();
    res.send(transaction);
  } catch (err) {
    console.log(`POST error: ${err}`);
    res.status(500).send(err);
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.query.id;

    console.log(req.params);

    if (!id) {
      res.status(400).send({ error: 'É necessário informar o parâmetro "id"' });
      return;
    }

    if (!req.body) {
      res.status(400).send({ error: 'Transação não informada.' });
      return;
    }

    const { year, month, day } = req.body;
    const { yearMonth, yearMonthDay } = formatDates(year, month, day);

    const transaction = await TransactionModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, yearMonth, yearMonthDay },
      {
        useFindAndModify: false,
        new: true,
      }
    );

    // if (transaction === null) {
    //   res.status(404).send({ erro: 'Documento não encontrado na coleção.' });
    // } else {
    //   res.send(orderFields(transaction));
    // }
    res.send(transaction);
  } catch (err) {
    console.log(`PUT/PATCH error: ${err}`);
    res.status(500).send(err);
  }
};
