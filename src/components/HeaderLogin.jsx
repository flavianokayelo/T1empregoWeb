import React from 'react';
import logo from '../assets/logo.jpg'; // ajuste o caminho se precisar

export default function HeaderLogin({ isLogin }) {


  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{isLogin ? 'Iniciar sessão' : 'Criar conta'}</h2>
      <img src={logo} alt="Logo" style={styles.logo} />
    </div>
  );
}

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 30,
    },
    title: {
      fontSize: 20,
      fontWeight: 700,
      margin: 0,
      color:'#225b79',
    },
    logo: {
      width: 40,
      height: 40,
      borderRadius: 10,
      objectFit: 'contain',
    },
  };