import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import './styles/admin.css';

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [dados, setDados] = useState({
    prestadores: 0,
    clientes: 0,
    provincias: 0,
    municipios: 0,
    bairros: 0,
    profissoes: 0,
    categorias: 0
  });

  useEffect(() => {
    fetch('https://t1emprego.com/api/dashboard.php')
      .then(res => res.json())
      .then(data => setDados(data))
      .catch(err => console.error('Erro ao carregar dados:', err));
  }, []);

  return (
    <div className={`admin-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <button
        className="hamburger-button"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <h1 className="dashboard-title">Painel de Administração</h1>
        <div className="cards-container">
          <Card titulo="Prestadores" valor={dados.prestadores} cor="primary" />
          <Card titulo="Clientes" valor={dados.clientes} cor="secondary" />
          <Card titulo="Províncias" valor={dados.provincias} cor="warning" />
          <Card titulo="Municípios" valor={dados.municipios} cor="primary" />
          <Card titulo="Bairros" valor={dados.bairros} cor="secondary" />
          <Card titulo="Profissões" valor={dados.profissoes} cor="warning" />
          <Card titulo="Categorias" valor={dados.categorias} cor="primary" />

          <Card titulo="Habilidades" valor={dados.categorias} cor="primary" />
        </div>
      </div>
    </div>
  );
}

function Card({ titulo, valor, cor }) {
  return (
    <div className={`card-dashboard ${cor}`}>
      <div className="card-body">
        <h3 className="card-titulo">{titulo}</h3>
        <p className="card-valor">{valor}</p>
      </div>
    </div>
  );
}
