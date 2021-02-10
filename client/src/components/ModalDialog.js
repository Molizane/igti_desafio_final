import React, { useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function ModalDialog({ children: message, id, onConfirm, onCancel }) {
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

  const handleCancel = () => {
    onCancel(null);
  };

  const handleConfirm = () => {
    onConfirm({ _id: id });
  };

  return (
    <Modal disablePortal isOpen={true} style={styles.modalStyle}>
      <div style={styles.flexRow}>
        <span style={styles.title}>Atenção:</span>
      </div>
      <div style={styles.flexRow}>
        <span style={styles.title}>{message}</span>
      </div>
      <div style={styles.flexRow}>
        <button className="waves-effect waves-light btn green dark-4" onClick={handleConfirm}>
          Sim
        </button>
        <button className="waves-effect waves-light btn red dark-4" onClick={handleCancel}>
          Não
        </button>
      </div>
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
    overlay: { zIndex: 1200 },
  },

  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '40px',
  },

  title: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '40px',
  },
};
