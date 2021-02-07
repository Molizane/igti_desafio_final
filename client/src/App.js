import React, { useState, useEffect } from 'react';
import dotenv from 'dotenv';

import Balance from './components/Balance.js';
import Functions from './components/Functions.js';
import Movements from './components/Movements.js';
import Navigator from './components/Navigator.js';
import * as api from './api/apiService.js';

const MONTHS = [
  { monthName: 'Jan' },
  { monthName: 'Fev' },
  { monthName: 'Mar' },
  { monthName: 'Abr' },
  { monthName: 'Mai' },
  { monthName: 'Jun' },
  { monthName: 'Jul' },
  { monthName: 'Ago' },
  { monthName: 'Set' },
  { monthName: 'Out' },
  { monthName: 'Nov' },
  { monthName: 'Dez' },
];

export default function App() {
  dotenv.config();

  //console.log(process.env.APIURL);

  const [periods, setPeriods] = useState([]);
  const [movements, setMovements] = useState({ length: 0, transactions: [] });
  const [filteredMovements, setFilteredMovements] = useState({ length: 0, transactions: [] });
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [qtMovements, setQtMovements] = useState(0);
  const [credit, setCredit] = useState(0);
  const [debit, setDebit] = useState(0);
  const [currentFilter, setCurrentFilter] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    console.log('Page Load');

    const p = [];
    const today = new Date();
    const thisYear = today.getYear() + 1900;
    const thisMonth = today.getMonth() + 1;
    let thisPeriod = '';

    for (let year = 2019; year <= 2021; year++) {
      for (let month = 1; month <= 12; month++) {
        const period = `${year}-${month < 10 ? '0' + month : month}`;
        const { monthName } = MONTHS[month - 1];
        const reg = { title: `${monthName}/${year}`, period };
        p.push(reg);

        if (year === thisYear && month === thisMonth) thisPeriod = reg;
      }
    }

    setPeriods(p);
    setCurrentPeriod(thisPeriod);
  }, []);

  useEffect(() => {
    const getPeriod = async () => {
      const movements = await api.getPeriod(currentPeriod.period);

      const { length, transactions } = movements;

      const credit = transactions.filter((trans) => trans.type === '+').reduce((acc, curr) => acc + curr.value, 0);
      const debit = transactions.filter((trans) => trans.type === '-').reduce((acc, curr) => acc + curr.value, 0);

      let filtered;

      if (currentFilter.trim() === '') {
        filtered = Object.assign([], movements);
      } else {
        filtered = transactions.filter(
          (transaction) => transaction.description.toUpperCase().indexOf(currentFilter.toUpperCase()) !== -1
        );
        filtered = { length: filtered.length, transactions: filtered };
      }

      setMovements(movements);
      setFilteredMovements(filtered);
      setQtMovements(length);
      setCredit(credit);
      setDebit(debit);
    };

    getPeriod();
  }, [currentPeriod, refresh]);

  useEffect(() => {
    let transactions;

    if (currentFilter.trim() === '') {
      transactions = Object.assign([], movements);
    } else {
      transactions = movements.transactions.filter(
        (transaction) => transaction.description.toUpperCase().indexOf(currentFilter.toUpperCase()) !== -1
      );

      transactions = { length: transactions.length, transactions };
    }

    setFilteredMovements(transactions);
  }, [currentFilter]);

  const handleChangePeriod = (period) => {
    if (period === '+' || period === '-') {
      const index = periods.findIndex((element) => element.period === currentPeriod.period);

      if ((period === '+' && index < periods.length - 1) || (period === '-' && index > 0)) {
        setCurrentPeriod(periods[period === '+' ? index + 1 : index - 1]);
      }

      return;
    }

    setCurrentPeriod(periods.find((element) => element.period === period));
  };

  const handleSearch = (text) => {
    setCurrentFilter(text);
  };

  const handleAddTransaction = () => {
    console.log('handleAddTransaction');
  };

  const handleEditButtonClick = (transaction) => {
    console.log(transaction);
  };

  const handleDeleteButtonClick = ({ _id }) => {
    const remove = async () => {
      await api.remove(_id);
      setRefresh(!refresh);
    };

    remove();
  };

  return (
    <div className="container" align="center">
      <h3>Bootcamp Full Stack - Desafio Final</h3>
      <span>Controle Finaceiro Pessoal</span>
      {currentPeriod !== '' && (
        <Navigator period={currentPeriod} onChangePeriod={handleChangePeriod}>
          {periods}
        </Navigator>
      )}
      <Balance>{{ qtMovements, credit, debit }}</Balance>
      <Functions onSearch={handleSearch} onAddTransaction={handleAddTransaction}>
        {currentFilter}
      </Functions>
      {movements.length > 0 && (
        <Movements onEditClick={handleEditButtonClick} onDeleteClick={handleDeleteButtonClick}>
          {filteredMovements}
        </Movements>
      )}
    </div>
  );
}
