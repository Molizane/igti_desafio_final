import React from 'react';

export default function Movement({ children: transaction, onEditClick, onDeleteClick }) {
  const handleEditClick = () => {
    onEditClick(transaction);
  };

  const handleDeleteClick = () => {
    onDeleteClick({ _id: transaction._id });
  };

  const numberFormat = Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatNumber = (number) => 'R$ ' + numberFormat.format(number);
  const style = { ...styles.flexRow, backgroundColor: transaction.type === '+' ? '#80cbc4' : '#ef9a9a' };

  return (
    <div key={transaction._id} style={style}>
      <div style={styles.flexRow2}>
        <div style={styles.day}>
          <span>{transaction.day < 10 ? '0' + transaction.day : transaction.day}</span>
        </div>
        <div style={styles.movement}>
          <span style={styles.bold}>{transaction.category}</span>
          <span>{transaction.description}</span>
        </div>
      </div>
      <div style={styles.tools}>
        <span style={styles.value}>{formatNumber(transaction.value)}</span>
        <i style={styles.i} className="material-icons" onClick={handleEditClick}>
          edit
        </i>
        <i style={styles.i} className="material-icons" onClick={handleDeleteClick}>
          delete
        </i>
      </div>
    </div>
  );
}

const styles = {
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    border: '1px solid lightgray',
    borderRadius: '5px',
    marginBottom: '5px',
  },

  flexRow2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },

  day: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginRight: '10px',
    paddingLeft: '10px',
  },

  movement: {
    fontSize: '1.2rem',
    margin: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'left',
    textAlign: 'left',
  },

  bold: {
    fontWeight: 'bold',
  },

  tools: {
    textAlign: 'center',
    alignContent: 'right',
    fontSize: '1.2rem',
    marginRight: '10px',
  },

  value: {
    textAlign: 'right',
    alignContent: 'right',
    fontSize: '1.2rem',
    marginRight: '60px',
    fontWeight: 'bold',
  },

  i: {
    cursor: 'pointer',
  },
};
