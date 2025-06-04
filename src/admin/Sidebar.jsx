import React from 'react';
import { Link } from 'react-router-dom';
import "./styles/sidebar.css"
export default function Sidebar({ isOpen, onClose }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <h2>T1emprego</h2>
      <nav>
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/Prestadores">Prestadores</Link>
        <Link to="/admin/clientes">Clientes</Link>
        <Link to="/Provincias">Provincias</Link>
        <Link to="/Municipios">Municipios</Link>
        <Link to="/Profissoes">Profissões</Link>
        <Link to="/Habilidades">Habilidades</Link>
      </nav>
    </div>
  );
}