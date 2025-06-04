import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import './styles/admin.css';
import './styles/habilidades.css';
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';

export default function Habilidades() {
  const [habilidades, setHabilidades] = useState([]);
  const [novaHabilidade, setNovaHabilidade] = useState('');
  const [editando, setEditando] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  useEffect(() => {
    carregarHabilidades();
  }, []);

  const carregarHabilidades = async () => {
    setCarregando(true);
    try {
      const res = await fetch('https://t1emprego.com/api/getHabilidades.php');
      const data = await res.json();
      setHabilidades(data);
    } catch (err) {
      setMensagem('Erro ao carregar habilidades.');
    }
    setCarregando(false);
  };

  const salvarHabilidade = async () => {
    if (!novaHabilidade.trim()) return;
    setCarregando(true);
    try {
      const endpoint = editando ? 'editarHabilidade.php' : 'adicionarHabilidade.php';
      const res = await fetch(`https://t1emprego.com/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editando,
          nome: novaHabilidade
        })
      });
      const result = await res.json();
      setMensagem(result.mensagem || 'Operação concluída.');
      setNovaHabilidade('');
      setEditando(null);
      carregarHabilidades();
    } catch (err) {
      setMensagem('Erro ao salvar.');
    }
    setCarregando(false);
  };

  const apagarHabilidade = async (id) => {
    if (!window.confirm('Deseja realmente excluir esta habilidade?')) return;
    setCarregando(true);
    try {
      const res = await fetch(`https://t1emprego.com/api/apagarHabilidade.php?id=${id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      setMensagem(result.mensagem || 'Habilidade excluída.');
      carregarHabilidades();
    } catch (err) {
      setMensagem('Erro ao excluir.');
    }
    setCarregando(false);
  };

  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const habilidadesPaginadas = habilidades.slice(indiceInicio, indiceFim);
  const totalPaginas = Math.ceil(habilidades.length / itensPorPagina);

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <h2 className="titulo">Gestão de Habilidades</h2>

        {mensagem && <div className="alerta">{mensagem}</div>}

        <div className="form-habilidade">
          <input
            type="text"
            placeholder="Nome da habilidade"
            value={novaHabilidade}
            onChange={e => setNovaHabilidade(e.target.value)}
          />
          <button onClick={salvarHabilidade} className="btn-salvar">
            {carregando ? <FaSpinner className="spinner" /> : (editando ? <><FaEdit /> Atualizar</> : <><FaPlus /> Adicionar</>)}
          </button>
        </div>

        <div className="tabela-responsive">
          <table className="tabela-habilidades">
            <thead>
              <tr>
                <th>ID</th>
                <th>Habilidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {habilidadesPaginadas.map((h, idx) => (
                <tr key={idx}>
                  <td>{h.id}</td>
                  <td>{h.nome}</td>
                  <td>
                    <button className="btn-editar" onClick={() => {
                      setEditando(h.id);
                      setNovaHabilidade(h.nome);
                    }}><FaEdit /></button>
                    <button className="btn-excluir" onClick={() => apagarHabilidade(h.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="paginacao">
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              className={paginaAtual === i + 1 ? 'pagina ativa' : 'pagina'}
              onClick={() => setPaginaAtual(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
