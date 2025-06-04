import React, { useEffect, useState } from 'react';
import './styles/prestadores.css';
import Sidebar from './Sidebar';

export default function Prestadores() {
  const [prestadores, setPrestadores] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroProfissao, setFiltroProfissao] = useState('');
  const [profissoes, setProfissoes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [emailSelecionado, setEmailSelecionado] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [modalStatusAberto, setModalStatusAberto] = useState(false);
  const [statusSelecionado, setStatusSelecionado] = useState('');
  const [usuarioIdSelecionado, setUsuarioIdSelecionado] = useState('');
  const [nomeSelecionado, setNomeSelecionado] = useState('');

  // pegar todos os prestador do banco de dados
  useEffect(() => {
    fetch('https://t1emprego.com//api/prestadoresLista.php')
      .then(res => res.json())
      .then(data => {
        setPrestadores(data.data);
        const listaProfissoes = [...new Set(data.data.map(p => p.profissao))];
        setProfissoes(listaProfissoes);
      })
      .catch(err => console.error('Erro ao buscar prestadores:', err));
  }, []);

  const prestadoresFiltrados = prestadores.filter(p =>
    (
      p.username.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      p.email.toLowerCase().includes(filtroTexto.toLowerCase())
    ) &&
    (
      filtroProfissao === '' || p.profissao.toLowerCase() === filtroProfissao.toLowerCase()
    )
  );

  // abrir o modal de enviar email mensagem
  const abrirModal = (email) => {
    setEmailSelecionado(email);
    setMensagem('');
    setModalAberto(true);
  };

  // enviar email para os prestadores de servicos
  const enviarMensagem = async () => {
    if (!mensagem.trim()) {
      alert('Por favor, escreva uma mensagem antes de enviar.');
      return;
    }

    try {
      const resposta = await fetch('https://t1emprego.com/api/enviarEmail.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: emailSelecionado,
          mensagem: mensagem
        })
      });

      const resultado = await resposta.json();

      if (resposta.ok && resultado.sucesso) {
        alert(`Mensagem enviada para ${emailSelecionado}`);
        setModalAberto(false);
        setMensagem(''); // limpa o campo
      } else {
        alert(`Erro ao enviar: ${resultado.mensagem || 'Tente novamente mais tarde.'}`);
      }

    } catch (erro) {
      console.error('Erro ao enviar e-mail:', erro);
      alert('Erro ao enviar a mensagem. Verifique sua conexão ou tente mais tarde.');
    }
  };

  // abrir modal para alterar o status
  const abrirModalStatus = (userid, nome, statusAtual) => {
    setUsuarioIdSelecionado(userid);
    setNomeSelecionado(nome);
    setStatusSelecionado(statusAtual);
    setModalStatusAberto(true);
  };

  // função que altera o status
  const alterarStatus = async () => {
    try {
      const resposta = await fetch('https://t1emprego.com/api/alterarStatus.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userid: usuarioIdSelecionado,
          novoStatus: statusSelecionado
        })
      });

      const resultado = await resposta.json();

      if (resposta.ok && resultado.sucesso) {
        alert(`Status de ${nomeSelecionado} alterado para "${statusSelecionado}".`);
        setModalStatusAberto(false);

        // Atualiza a lista local
        setPrestadores(prev =>
          prev.map(p =>
            p.userid === usuarioIdSelecionado ? { ...p, status: statusSelecionado } : p
          )
        );
      } else {
        alert(`Erro: ${resultado.mensagem || 'Não foi possível alterar o status.'}`);
      }

    } catch (erro) {
      console.error('Erro ao alterar status:', erro);
      alert('Erro na conexão. Tente novamente mais tarde.');
    }
  };

  return (
    <>
      <div className="container-prestadores">

        {/* Botão para abrir/fechar sidebar */}
        <button
          className="btn-toggle-sidebar"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? 'Fechar Menu' : 'Abrir Menu'}
        </button>

        <div className="content-with-sidebar">

          {/* Sidebar */}
          {isSidebarOpen && <Sidebar />}

          {/* Conteúdo principal */}
          <div className="main-content">

            <h1 className="titulo">Gestão de Prestadores</h1>

            <div className="filtros">
              <input
                type="text"
                placeholder="Pesquisar por nome ou email..."
                value={filtroTexto}
                onChange={e => setFiltroTexto(e.target.value)}
                className="input-pesquisa"
              />

              <select
                value={filtroProfissao}
                onChange={e => setFiltroProfissao(e.target.value)}
                className="select-profissao"
              >
                <option value="">Todas as profissões</option>
                {profissoes.map((prof, idx) => (
                  <option key={idx} value={prof}>{prof}</option>
                ))}
              </select>
            </div>

            <div className="tabela-container">
              <table className="tabela-prestadores">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Profissão</th>
                    <th>Província</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {prestadoresFiltrados.map((p, index) => (
                    <tr key={index}>
                      <td>{p.userid}</td>
                      <td>{p.username}</td>
                      <td>
                        <button className="email-link" onClick={() => abrirModal(p.email)}>
                          {p.email}
                        </button>
                      </td>
                      <td>{p.number}</td>
                      <td>{p.profissao}</td>
                      <td>{p.provincia}</td>
                      <td>
                        <span
                          className={p.status === 'ativo' ? 'status-ativo' : 'status-inativo'}
                          onClick={() => abrirModalStatus(p.userid, p.username, p.status)}
                          style={{ cursor: 'pointer' }}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn-ver">Ver</button>
                        <button className="btn-excluir">Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal de mudar status */}
            {modalStatusAberto && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2>Alterar Status</h2>
                  <p><strong>Prestador:</strong> {nomeSelecionado}</p>
                  <p><strong>Status atual:</strong> {statusSelecionado}</p>

                  <select
                    value={statusSelecionado}
                    onChange={e => setStatusSelecionado(e.target.value)}
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>

                  <div className="modal-botoes">
                    <button className="btn-enviar" onClick={alterarStatus}>Salvar</button>
                    <button className="btn-cancelar" onClick={() => setModalStatusAberto(false)}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal enviar mensagem email */}
            {modalAberto && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2>Enviar Email</h2>
                  <p><strong>Para:</strong> {emailSelecionado}</p>
                  <textarea
                    placeholder="Digite sua mensagem..."
                    value={mensagem}
                    onChange={e => setMensagem(e.target.value)}
                    rows={5}
                  />
                  <div className="modal-botoes">
                    <button className="btn-enviar" onClick={enviarMensagem}>Enviar</button>
                    <button className="btn-cancelar" onClick={() => setModalAberto(false)}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
