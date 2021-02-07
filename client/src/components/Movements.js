import React from 'react';
import Movement from './Movement';

export default function Movements({ children: movements, onEditClick, onDeleteClick }) {
  const { transactions } = movements;

  return transactions.map((transaction) => {
    return (
      <Movement key={transaction._id} onEditClick={onEditClick} onDeleteClick={onDeleteClick}>
        {transaction}
      </Movement>
    );
  });
}
