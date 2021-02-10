import React, { useState, useEffect } from 'react';
import dotenv from 'dotenv';

import * as api from './api/apiService.js';

import Balance from './components/Balance.js';
import Functions from './components/Functions.js';
import Movements from './components/Movements.js';
import Navigator from './components/Navigator.js';
import ModalForm from './components/ModalForm.js';
import Spinner from './components/Spinner.js';

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

  const [isLoading, setIsLoading] = useState(false);
  const [periods, setPeriods] = useState([]);
  const [movements, setMovements] = useState({ length: 0, transactions: [] });
  const [filteredMovements, setFilteredMovements] = useState({ length: 0, transactions: [] });
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [qtMovements, setQtMovements] = useState(0);
  const [credit, setCredit] = useState(0);
  const [debit, setDebit] = useState(0);
  const [currentFilter, setCurrentFilter] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [isEditting, setIsEditting] = useState(false);
  const [transaction, setTransaction] = useState({});
  const [editType, setEditType] = useState('');

  useEffect(() => {
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
    console.log('useEffect [currentPeriod, refresh]');
    setIsLoading(true);

    const getPeriod = async () => {
      const movements = await api.getPeriod(currentPeriod.period);
      const transactions = movements.transactions.sort((a, b) => a.yearMonthDay.localeCompare(b.yearMonthDay));
      setMovements({ ...movements, transactions });
      setIsLoading(false);
    };

    getPeriod();
  }, [currentPeriod, refresh]);

  useEffect(() => {
    console.log('useEffect [currentFilter, movements]');
    let transactions;

    if (currentFilter.trim() === '') {
      transactions = Object.assign([], movements);
    } else {
      transactions = movements.transactions.filter((transaction) => transaction.description.toUpperCase().indexOf(currentFilter.toUpperCase()) !== -1);
      transactions = { length: transactions.length, transactions };
    }

    const { length } = transactions;
    const credit = transactions.transactions.filter((trans) => trans.type === '+').reduce((acc, curr) => acc + curr.value, 0);
    const debit = transactions.transactions.filter((trans) => trans.type === '-').reduce((acc, curr) => acc + curr.value, 0);

    setQtMovements(length);
    setCredit(credit);
    setDebit(debit);
    setFilteredMovements(transactions);
  }, [currentFilter, movements]);

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

  const handleInsert = () => {
    setEditType('I');
    setTransaction({});
    setIsEditting(true);
  };

  const handleEdit = (transaction) => {
    setEditType('E');
    setTransaction(transaction);
    setIsEditting(true);
  };

  const handleDelete = ({ _id }) => {
    const remove = async () => {
      await api.remove(_id);
      setRefresh(!refresh);
    };

    remove();
  };

  const handleSave = (type, _id, transaction) => {
    if (type === 'I') {
      const insert = async () => {
        await api.insert(transaction);
        setRefresh(!refresh);
      };

      insert();
    } else {
      const update = async () => {
        await api.update(transaction, _id);
        setRefresh(!refresh);
      };

      update();
    }

    setIsEditting(false);
  };

  const handleFormClosed = () => {
    setIsEditting(false);
  };

  return (
    <div className="container" align="center" id="Panel">
      <h3>Bootcamp Full Stack - Desafio Final</h3>
      <h4>Controle Finaceiro Pessoal</h4>
      {isLoading && <Spinner></Spinner>}
      {currentPeriod && (
        <Navigator period={currentPeriod} onChangePeriod={handleChangePeriod}>
          {periods}
        </Navigator>
      )}
      <Balance>{{ qtMovements, credit, debit }}</Balance>
      <Functions onSearch={handleSearch} onAddTransaction={handleInsert}>
        {currentFilter}
      </Functions>
      {movements.length > 0 && (
        <Movements onEditClick={handleEdit} onDeleteClick={handleDelete}>
          {filteredMovements}
        </Movements>
      )}
      {isEditting && (
        <ModalForm editType={editType} onSave={handleSave} onCancel={handleFormClosed}>
          {transaction}
        </ModalForm>
      )}
    </div>
  );
}
