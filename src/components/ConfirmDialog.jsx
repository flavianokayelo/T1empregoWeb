import React from 'react';

const ConfirmDialog = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Confirmação</h2>
        <p style={styles.message}>{message}</p>
        <div style={styles.buttons}>
          <button onClick={onConfirm} style={{ ...styles.button, ...styles.confirm }}>
            Sim
          </button>
          <button onClick={onCancel} style={{ ...styles.button, ...styles.cancel }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '30px 25px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    fontFamily: "'Segoe UI', sans-serif",
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '15px',
    color: '#333',
  },
  message: {
    fontSize: '1.1rem',
    color: '#555',
  },
  buttons: {
    marginTop: '25px',
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
  },
  button: {
    fontSize: '1rem',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s ease',
  },
  confirm: {
    backgroundColor: '#28a745',
    color: '#fff',
  },
  cancel: {
    backgroundColor: '#dc3545',
    color: '#fff',
  },
};

export default ConfirmDialog;
