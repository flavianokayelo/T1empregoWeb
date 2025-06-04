import React from 'react';
import Header from '../components/Header';
import RodapeNavegacao from '../components/RodapeNavegacao';
import Servico from '../components/Servico';

export default function Servicos() {
  return (
    <>
      <Header isPerfil={true} />
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <h2 style={styles.title}>💼 Serviços de Tyler Kayelo</h2>
          <Servico />
        </div>
      </div>
      <RodapeNavegacao />
    </>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: '30px 20px',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  container: {
    width: '100%',
    maxWidth: '900px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
};
