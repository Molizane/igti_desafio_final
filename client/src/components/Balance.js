import React from 'react';

export default function Balance({ children }) {
  let { credit, debit, qtMovements } = children;

  const numberFormatFloat = Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatNumberFloat = (number) => numberFormatFloat.format(number);

  const numberFormatInt = Intl.NumberFormat('pt-BR');
  const formatNumberInt = (number) => numberFormatInt.format(number);

  credit = parseFloat(credit);
  debit = parseFloat(debit);
  qtMovements = parseInt(qtMovements);

  const balance = credit - debit;
  const balanceColor = balance > 0 ? '#00897b' : '#b71c1c   ';

  return (
    <div style={styles.flexRow2}>
      <div style={styles.styleFieds}>
        <span>Lançamentos:</span>
        <span style={styles.styleValues}>{formatNumberInt(qtMovements)}</span>
      </div>
      <div style={styles.styleFieds}>
        <span>Receitas:</span>
        <span style={{ ...styles.styleValues, color: '#00897b' }}>R$ {formatNumberFloat(credit)}</span>
      </div>
      <div style={styles.styleFieds}>
        <span>Despesas:</span>
        <span style={{ ...styles.styleValues, color: '#b71c1c   ' }}>R$ {formatNumberFloat(debit)}</span>
      </div>
      <div style={{ ...styles.styleFieds, marginRight: '5px', alignItems: 'right' }} className="right">
        <span>Saldo: </span>
        <span style={{ ...styles.styleValues, color: balanceColor }}>R$ {formatNumberFloat(Math.abs(balance))}</span>
      </div>
    </div>
  );
}

const styles = {
  styleValues: {
    marginLeft: '5px',
  },

  styleFieds: {
    paddingLeft: '10px',
    paddingRight: '10px',
  },

  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid lightgray',
    borderRadius: '5px',
    marginBottom: '30px',
  },

  flexRow2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    border: '1px solid lightgray',
    borderRadius: '5px',
    marginBottom: '30px',
  },
};
