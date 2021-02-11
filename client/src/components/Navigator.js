import React from 'react';

export default function Navigator({ children: periods, period, onChangePeriod }) {
  const handlePeriodChange = (currentTarget) => {
    onChangePeriod(currentTarget.value);
  };

  const handlePreviousPeriod = () => {
    onChangePeriod('-');
  };

  const handleNextPeriod = () => {
    onChangePeriod('+');
  };

  const makeItem = (X) => {
    const { title, period } = X;
    return (
      <option key={period} value={period}>
        {title}
      </option>
    );
  };

  return (
    <div className="container" style={styles.flexRow}>
      <button
        className="waves-effect waves-light btn teal darken-1"
        style={{ zIndex: 0 }}
        onClick={handlePreviousPeriod}
        disabled={period && period.period.trim() === '2019-01'}
      >
        {'<'}
      </button>
      <div className="input-field col s12">
        <select className="browser-default" value={period.period} onChange={handlePeriodChange}>
          {periods.map(makeItem)}
        </select>
      </div>
      <button
        className="waves-effect waves-light btn teal darken-1"
        style={{ zIndex: 0 }}
        onClick={handleNextPeriod}
        disabled={period && period.period.trim() === '2021-12'}
      >
        {'>'}
      </button>
    </div>
  );
}

const styles = {
  style: {
    marginLeft: '5px',
  },

  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px',
  },
};
