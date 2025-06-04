import React, { useEffect, useState } from 'react';
import './styles/municipios.css';

export default function Municipios() {
  const [municipios, setMunicipios] = useState([]);
  const [provincias, setProvincias] = useState([]);

  const [modalAdicionarAberto, setModalAdicionarAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);

  const [nomeNovoMunicipio, setNomeNovoMunicipio] = useState('');
  const [provinciaSelecionada, setProvinciaSelecionada] = useState('');

  const [municipioEditarId, setMunicipioEditarId] = useState(null);
  const [nomeEditarMunicipio, setNomeEditarMunicipio] = useState('');
  const [provinciaEditarSelecionada, setProvinciaEditarSelecionada] = useState('');

  const [filtroProvincia, setFiltroProvincia] = useState('');

  // Carregar municípios e províncias ao montar
  useEffect(() => {
    fetch('https://t1emprego.com/api/listaMunicipios.php')
      .then(res => res.json())
      .then(data => {
        if (data.success === true) {
          setMunicipios(data.data);
        } else {
          alert('Erro ao carregar municípios');
        }
      })
      .catch(() => alert('Erro na conexão ao carregar municípios'));

    fetch('https://t1emprego.com/api/get_provincias.php')
      .then(res => res.json())
      .then(data => {
        if (data.success === true) {
          setProvincias(data.data);
        } else alert('Erro ao carregar províncias');
      })
      .catch(() => alert('Erro na conexão ao carregar províncias'));
  }, []);

  // Abrir modal adicionar
  const abrirModalAdicionar = () => {
    setNomeNovoMunicipio('');
    setProvinciaSelecionada('');
    setModalAdicionarAberto(true);
  };

  // Adicionar município
  const adicionarMunicipio = () => {
    if (!nomeNovoMunicipio.trim()) {
      alert('Informe o nome do município');
      return;
    }
    if (!provinciaSelecionada) {
      alert('Selecione a província');
      return;
    }

    fetch('https://t1emprego.com/api/adicionarMunicipio.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: nomeNovoMunicipio.trim(),
        provincia_id: provinciaSelecionada,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.sucesso) {
          setMunicipios(prev => [
            ...prev,
            {
              id: data.id,
              nome: nomeNovoMunicipio.trim(),
              provincia_id: provinciaSelecionada,
              provincia_nome:
                provincias.find(p => String(p.id) === String(provinciaSelecionada))?.nome || '',
            },
          ]);
          setModalAdicionarAberto(false);
        } else {
          alert('Erro ao adicionar município: ' + (data.mensagem || 'Tente novamente'));
        }
      })
      .catch(() => alert('Erro na conexão ao adicionar município'));
  };

  // Abrir modal editar
  const abrirModalEditar = municipio => {
    setMunicipioEditarId(municipio.id);
    setNomeEditarMunicipio(municipio.nome);
    setProvinciaEditarSelecionada(String(municipio.provincia_id));
    setModalEditarAberto(true);
  };

  // Editar município
  const editarMunicipio = () => {
    if (!nomeEditarMunicipio.trim()) {
      alert('Informe o nome do município');
      return;
    }
    if (!provinciaEditarSelecionada) {
      alert('Selecione a província');
      return;
    }

    fetch('https://t1emprego.com/api/editarMunicipio.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: municipioEditarId,
        nome: nomeEditarMunicipio.trim(),
        provincia_id: provinciaEditarSelecionada,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.sucesso) {
          setMunicipios(prev =>
            prev.map(m =>
              m.id === municipioEditarId
                ? {
                    ...m,
                    nome: nomeEditarMunicipio.trim(),
                    provincia_id: provinciaEditarSelecionada,
                    provincia_nome:
                      provincias.find(p => String(p.id) === String(provinciaEditarSelecionada))?.nome || '',
                  }
                : m
            )
          );
          setModalEditarAberto(false);
        } else {
          alert('Erro ao editar município: ' + (data.mensagem || 'Tente novamente'));
        }
      })
      .catch(() => alert('Erro na conexão ao editar município'));
  };

  // Apagar município
  const apagarMunicipio = id => {
    if (!window.confirm('Tem certeza que deseja apagar este município?')) return;

    fetch('https://t1emprego.com/api/apagarMunicipio.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.sucesso) {
          setMunicipios(prev => prev.filter(m => m.id !== id));
        } else {
          alert('Erro ao apagar município: ' + (data.mensagem || 'Tente novamente'));
        }
      })
      .catch(() => alert('Erro na conexão ao apagar município'));
  };

  return (
    <div className="container-municipios">
      <h1>Gestão de Municípios</h1>

      <label htmlFor="filtroProvincia">Filtrar por Província:</label>
      <select
        id="filtroProvincia"
        value={filtroProvincia}
        onChange={e => setFiltroProvincia(e.target.value)}
      >
        <option value="">Todas as províncias</option>
        {provincias.map(p => (
          <option key={p.id} value={p.id}>
            {p.nome}
          </option>
        ))}
      </select>

      <button className="btn-adicionar" onClick={abrirModalAdicionar}>
        Adicionar Município
      </button>

      <table className="tabela-municipios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Município</th>
            <th>Província</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {municipios
            .filter(m => {
              if (!filtroProvincia) return true;
              return String(m.provincia_id) === filtroProvincia;
            })
            .map(m => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.nome}</td>
                <td>{m.provincia_nome || '---'}</td>
                <td>
                  <button className="btn-editar" onClick={() => abrirModalEditar(m)}>
                    Editar
                  </button>
                  <button className="btn-apagar" onClick={() => apagarMunicipio(m.id)}>
                    Apagar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal Adicionar */}
      {modalAdicionarAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Adicionar Município</h2>
            <input
              type="text"
              placeholder="Nome do município"
              value={nomeNovoMunicipio}
              onChange={e => setNomeNovoMunicipio(e.target.value)}
            />
            <select
              value={provinciaSelecionada}
              onChange={e => setProvinciaSelecionada(e.target.value)}
            >
              <option value="">Selecione a província</option>
              {provincias.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
            <div className="modal-botoes">
              <button className="btn-salvar" onClick={adicionarMunicipio}>
                Salvar
              </button>
              <button className="btn-cancelar" onClick={() => setModalAdicionarAberto(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {modalEditarAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Município</h2>
            <input
              type="text"
              value={nomeEditarMunicipio}
              onChange={e => setNomeEditarMunicipio(e.target.value)}
            />
            <select
              value={provinciaEditarSelecionada}
              onChange={e => setProvinciaEditarSelecionada(e.target.value)}
            >
              <option value="">Selecione a província</option>
              {provincias.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
            <div className="modal-botoes">
              <button className="btn-salvar" onClick={editarMunicipio}>
                Salvar
              </button>
              <button className="btn-cancelar" onClick={() => setModalEditarAberto(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
