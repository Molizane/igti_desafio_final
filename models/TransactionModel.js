const mongoose = require('mongoose');

let schema = mongoose.Schema(
  {
    description: { type: String, required: true },
    value: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    year: { type: Number, required: true, min: 2019, max: 2021 },
    month: { type: Number, required: true, min: 1, max: 12 },
    day: { type: Number, required: true, min: 1 },
    yearMonth: { type: String, required: true },
    yearMonthDay: { type: String, required: true },
    type: {
      type: String,
      required: true,
      validate(value) {
        if (value !== '-' && value != '+') {
          throw new Error('Tipo inválido.');
        }
      },
    },
  },
  {
    versionKey: false,
  }
);

const TransactionModel = mongoose.model('transaction', schema);

module.exports = TransactionModel;
