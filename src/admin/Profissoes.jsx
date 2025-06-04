import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import './styles/admin.css';
import './styles/profissoes.css';
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';

export default function Profissoes() {
  const [categorias, setCategorias] = useState([]);
  const [profissoes, setProfissoes] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [novaProfissao, setNovaProfissao] = useState('');
  const [editando, setEditando] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;
  const totalPaginas = Math.ceil(profissoes.length / itensPorPagina);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const resCat = await fetch('https://t1emprego.com/api/getCategorias.php');
      const categoriasData = await resCat.json();
      setCategorias(categoriasData);

      const resProf = await fetch('https://t1emprego.com/api/getProfissoes.php');
      const profissoesData = await resProf.json();
      setProfissoes(profissoesData);
    } catch (err) {
      setMensagem('Erro ao carregar dados.');
      console.error(err);
    }
    setCarregando(false);
  };

  const salvarProfissao = async () => {
    if (!novaProfissao.trim() || !categoriaSelecionada) return;
    setCarregando(true);
    try {
      const endpoint = editando ? 'editarProfissao.php' : 'adicionarProfissao.php';
      const res = await fetch(`https://t1emprego.com/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editando,
          nome: novaProfissao,
          categoria_id: categoriaSelecionada
        })
      });
      const result = await res.json();
      console.log(result)
      setMensagem(result.mensagem || 'Operação realizada.');
      setNovaProfissao('');
      setEditando(null);
      carregarDados();
    } catch (err) {
      setMensagem('Erro ao salvar.');
    }
    setCarregando(false);
  };

  const apagarProfissao = async (id) => {
    if (!window.confirm('Deseja realmente excluir esta profissão?')) return;
    setCarregando(true);
    try {
      const res = await fetch(`https://t1emprego.com/api/apagarProfissao.php?id=${id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      setMensagem(result.mensagem || 'Excluído com sucesso.');
      carregarDados();
    } catch (err) {
      setMensagem('Erro ao excluir.');
    }
    setCarregando(false);
  };

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  // Cálculo de página atual
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const profissoesExibidas = profissoes.slice(indiceInicial, indiceInicial + itensPorPagina);

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <h2 className="titulo">Gestão de Profissões</h2>

        {mensagem && <div className="alerta">{mensagem}</div>}

        <div className="form-profissao">
          <select value={categoriaSelecionada} onChange={e => setCategoriaSelecionada(e.target.value)}>
            <option value="">Selecione uma categoria</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Nome da profissão"
            value={novaProfissao}
            onChange={e => setNovaProfissao(e.target.value)}
          />
          <button onClick={salvarProfissao} className="btn-salvar">
            {carregando ? <FaSpinner className="spinner" /> : (editando ? <><FaEdit /> Atualizar</> : <><FaPlus /> Adicionar</>)}
          </button>
        </div>

        <div className="tabela-responsive">
          <table className="tabela-profissoes">
            <thead>
              <tr>
                <th>ID</th>
                <th>Profissão</th>
                <th>Categoria</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {profissoesExibidas.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.id}</td>
                  <td>{p.nome}</td>
                  <td>{p.categoria_nome}</td>
                  <td>
                    <button className="btn-editar" onClick={() => {
                      setEditando(p.id);
                      setNovaProfissao(p.nome);
                      setCategoriaSelecionada(p.categoria_id);
                    }}><FaEdit /></button>
                    <button className="btn-excluir" onClick={() => apagarProfissao(p.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="paginacao">
            <button onClick={() => mudarPagina(paginaAtual - 1)} disabled={paginaAtual === 1}>Anterior</button>
            {[...Array(totalPaginas)].map((_, i) => (
              <button
                key={i}
                onClick={() => mudarPagina(i + 1)}
                className={paginaAtual === i + 1 ? 'ativo' : ''}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => mudarPagina(paginaAtual + 1)} disabled={paginaAtual === totalPaginas}>Próxima</button>
          </div>
        )}
      </div>
    </div>
  );
}
