import React from 'react';

export default function Functions({ children: text, onSearch, onAddTransaction }) {
  const handleTextChange = (event) => {
    const newText = event.target.value;
    onSearch(newText);
  };

  const handleAddTransaction = () => {
    onAddTransaction();
  };

  return (
    <div style={styles.flexRow}>
      <button className="waves-effect waves-light btn teal darken-1" style={styles.button} onClick={handleAddTransaction}>
        + NOVO LANÇAMENTO
      </button>
      <input className="form-control" style={{ marginLeft: '10px' }} type="text" placeholder="Filtro" value={text} onChange={handleTextChange}></input>
    </div>
  );
}

const styles = {
  style: {
    marginLeft: '5px',
  },

  button: {
    width: '250px',
  },

  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'left',
    justifyContent: 'Left',
    padding: '5px',
  },
};
