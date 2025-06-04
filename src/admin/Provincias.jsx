import React, { useEffect, useState } from 'react';
import './styles/provincias.css';

export default function Provincias() {
  const [provincias, setProvincias] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [provinciaNome, setProvinciaNome] = useState('');
  const [provinciaEditarNome, setProvinciaEditarNome] = useState('');
  const [provinciaEditarId, setProvinciaEditarId] = useState(null);

  // Carregar provincias do backend
  useEffect(() => {
    fetch('https://t1emprego.com/api/get_provincias.php')
      .then(res => res.json())

      .then(data => {
              console.log(data)
        if (data.success == true) {
          setProvincias(data.data);
        } else {
          alert('Erro ao carregar provincias.');
        }
      })
      .catch(() => alert('Erro na conexão ao carregar provincias.'));
  }, []);

  // Abrir modal para adicionar
  const abrirModalAdicionar = () => {
    setProvinciaNome('');
    setModalAberto(true);
  };

  // Adicionar nova provincia
  const adicionarProvincia = () => {
    if (!provinciaNome.trim()) {
      alert('Informe o nome da província.');
      return;
    }

    fetch('https://t1emprego.com/api/adicionarProvincia.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: provinciaNome.trim() }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.sucesso) {
          setProvincias(prev => [...prev, { id: data.id, nome: provinciaNome.trim() }]);
          setModalAberto(false);
        } else {
          alert('Erro ao adicionar província: ' + (data.mensagem || 'Tente novamente.'));
        }
      })
      .catch(() => alert('Erro na conexão ao adicionar província.'));
  };

  // Abrir modal para editar
  const abrirModalEditar = (provincia) => {
    setProvinciaEditarId(provincia.id);
    setProvinciaEditarNome(provincia.nome);
    setModalEditarAberto(true);
  };

  // Editar provincia
  const editarProvincia = () => {
    if (!provinciaEditarNome.trim()) {
      alert('Informe o nome da província.');
      return;
    }

    fetch('https://t1emprego.com/api/editarProvincia.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: provinciaEditarId,
        nome: provinciaEditarNome.trim(),
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.sucesso) {
          setProvincias(prev =>
            prev.map(p =>
              p.id === provinciaEditarId ? { ...p, nome: provinciaEditarNome.trim() } : p
            )
          );
          setModalEditarAberto(false);
        } else {
          alert('Erro ao editar província: ' + (data.mensagem || 'Tente novamente.'));
        }
      })
      .catch(() => alert('Erro na conexão ao editar província.'));
  };

  // Apagar provincia
  const apagarProvincia = (id) => {
    if (!window.confirm('Tem certeza que deseja apagar esta província?')) return;

    fetch('https://t1emprego.com/api/apagarProvincia.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.sucesso) {
          setProvincias(prev => prev.filter(p => p.id !== id));
        } else {
          alert('Erro ao apagar província: ' + (data.mensagem || 'Tente novamente.'));
        }
      })
      .catch(() => alert('Erro na conexão ao apagar província.'));
  };

  return (
    <div className="container-provincias">
      <h1>Gestão de Províncias</h1>

      <button className="btn-adicionar" onClick={abrirModalAdicionar}>
        Adicionar Província
      </button>

      <table className="tabela-provincias">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome da Província</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {provincias.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nome}</td>
              <td>
                <button className="btn-editar" onClick={() => abrirModalEditar(p)}>Editar</button>
                <button className="btn-apagar" onClick={() => apagarProvincia(p.id)}>Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Adicionar */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Adicionar Província</h2>
            <input
              type="text"
              placeholder="Nome da província"
              value={provinciaNome}
              onChange={e => setProvinciaNome(e.target.value)}
            />
            <div className="modal-botoes">
              <button className="btn-salvar" onClick={adicionarProvincia}>Salvar</button>
              <button className="btn-cancelar" onClick={() => setModalAberto(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {modalEditarAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Província</h2>
            <input
              type="text"
              value={provinciaEditarNome}
              onChange={e => setProvinciaEditarNome(e.target.value)}
            />
            <div className="modal-botoes">
              <button className="btn-salvar" onClick={editarProvincia}>Salvar</button>
              <button className="btn-cancelar" onClick={() => setModalEditarAberto(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
