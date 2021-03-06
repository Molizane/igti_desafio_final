import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function ModalForm({ children: transaction, editType, onSave, onCancel }) {
  const [currTransaction] = useState(transaction);
  const [currEditType] = useState(editType);

  const [_id] = useState(transaction._id);
  const [year] = useState(transaction.year);
  const [month] = useState(transaction.month);
  const [day] = useState(transaction.day);

  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [value, setValue] = useState(0);
  const [date, setDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let year_, month_, day_;

    if (currEditType === 'I' || !year || !month || !day) {
      const dt = new Date();
      year_ = dt.getFullYear();
      month_ = dt.getMonth() + 1;
      day_ = dt.getDate();
    } else {
      year_ = year;
      month_ = month;
      day_ = day;
    }

    const d = ('0000' + year_).slice(-4) + '-' + ('00' + month_).slice(-2) + '-' + ('00' + day_).slice(-2);
    setDate(d);

    if (currEditType !== 'I') {
      setType(currTransaction.type);
      setDescription(currTransaction.description);
      setCategory(currTransaction.category);
      setValue(currTransaction.value);
    }
  }, [currTransaction, currEditType, year, month, day]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onCancel(null);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    let errors = '';

    if (!type || type.trim().length === 0) {
      errors = 'Desespesa/Receita não informado, ';
    }

    if (!description || description.trim().length === 0) {
      errors += 'Descrição não informada, ';
    }

    if (!category || category.trim().length === 0) {
      errors += 'Categoria não informada, ';
    }

    if (!value) {
      errors += 'Valor não informada, ';
    } else {
      const v = parseFloat(value);

      if (isNaN(v) || v <= 0) {
        errors += 'Valor inválido, ';
      }
    }

    if (errors) {
      setErrorMessage(errors);
      return;
    }

    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);

    const transaction = {
      ...currTransaction,
      description,
      value,
      category,
      year,
      month,
      day,
      type,
    };

    onSave(editType, _id, transaction);
  };

  const handleModalClose = () => {
    onCancel(null);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
    setErrorMessage('');
  };

  const handleDescription = (event) => {
    setDescription(event.target.value);
    setErrorMessage('');
  };

  const handleCategory = (event) => {
    setCategory(event.target.value);
    setErrorMessage('');
  };

  const handleValue = (event) => {
    const v = event.target.value;

    if (v !== '') {
      const n = v.slice(-1);

      if (n !== '.' && (n < '0' || n > '9')) {
        return;
      }

      if (n === '.' && v.indexOf('.') !== v.length - 1) {
        return;
      }
    }

    setValue(v);
    setErrorMessage('');
  };

  const handleDate = (event) => {
    setDate(event.target.value);
    setErrorMessage('');
  };

  return (
    <Modal disablePortal isOpen={true} style={styles.modalStyle}>
      <div style={styles.flexRow}>
        <span style={styles.title}>{`${editType === 'I' ? 'Inclus' : 'Alteraç'}ão de lançamento`}</span>
        <button className="waves-effect waves-lights btn red dark-4" onClick={handleModalClose}>
          X
        </button>
      </div>
      <form onSubmit={handleFormSubmit}>
        <div style={{ border: '1px solid lightgray', padding: '10px', marginBottom: '30px' }}>
          <div style={styles.radio}>
            <label>
              <input name="radioDespesaReceita" type="radio" value="-" checked={type === '-'} disabled={editType === 'E'} onChange={handleTypeChange} />
              <span style={styles.despesa}>Despesa</span>
            </label>
            <label style={{ marginLeft: '60px' }}>
              <input name="radioDespesaReceita" type="radio" value="+" checked={type === '+'} disabled={editType === 'E'} onChange={handleTypeChange} />
              <span style={styles.receita}>Receita</span>
            </label>
          </div>
          <div className="input-field">
            <input id="inputDescription" type="text" autofocus required value={description} onChange={handleDescription} />
            <label className="active" htmlFor="inputDescription">
              Descrição:
            </label>
          </div>
          <div className="input-field">
            <input id="inputCategory" type="text" autofocus required value={category} onChange={handleCategory} />
            <label className="active" htmlFor="inputCategory">
              Categoria:
            </label>
          </div>
          <div style={styles.data}>
            <div className="input-field" style={{ marginRight: '20px' }}>
              <input id="inputValue" type="number" autofocus required value={value} style={{ textAlign: 'right' }} onChange={handleValue} />
              <label className="active" htmlFor="inputValue">
                Valor:
              </label>
            </div>
            <div className="input-field">
              <input id="inputDate" type="date" autofocus required value={date} onChange={handleDate} />
              <label className="active" htmlFor="inputDate">
                Data:
              </label>
            </div>
          </div>
        </div>
        <div style={styles.flexRow}>
          <button className="waves-effect waves-light btn" disabled={errorMessage.trim() !== ''}>
            Salvar
          </button>
          <span style={styles.errorMessage}>{errorMessage}</span>
        </div>
      </form>
    </Modal>
  );
}

const styles = {
  modalStyle: {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
    overlay: { zIndex: 1000 },
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '40px',
  },

  radio: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '40px',
    marginTop: '10px',
  },

  data: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'left',
  },

  title: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },

  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  },

  despesa: {
    color: '#b71c1c',
    fontWeight: 'bold',
  },

  receita: {
    color: '#00897b',
    fontWeight: 'bold',
  },

  form: { margin: '10px', zIndex: 1100 },
};
