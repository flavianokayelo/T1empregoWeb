import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Buscar from './pages/Buscar';
import PrestadorServico from './pages/PrestadorServico';
import Perfil from './pages/Perfil';
import Settings from './pages/Settings'
import Curriculo from './pages/Curriculo';
import Login from './pages/Login';
import Register from './pages/Register';
import CurriculoForm from './pages/CurriculoForm';
import Servicos from './pages/Servicos'
import Fotos from './pages/Fotos'
import CriarServico from './pages/CriarServico'
import  CriarPost from './pages/CriarPost'
import Notificacoes from './pages/Notificacoes';
import AllMyServices from './pages/AllMyServices';
import EsqueciSenha from './pages/EsqueciSenha';
import ChatApp from './pages/ChatApp';
import Conversations from './pages/Conversations';
import AdminLayout from './admin/AdminLayout';
import Prestadores from './admin/Prestadores';
import Profissoes from './admin/Profissoes';
import Habilidades from './admin/Habilidades';
import Provincias from './admin/Provincias';
import Municipios from './admin/Municipios';
function AppRoutes() {
  return (
    <Routes>

       <Route path="/" element={<Home />} />
       <Route path="/Login" element={<Login/>} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Feed" element={<Feed />} />
      <Route path="/Register" element={<Register/>} />
      <Route path="/Buscar" element={<Buscar />} />
      <Route path="/Perfil/:userid" element={<Perfil />} />
      <Route path="/Perfil" element={<Perfil />} />
      <Route path="/Settings" element={<Settings />} />
      <Route path="/Curriculo" element={<Curriculo />} />
      <Route path="/AllMyServices/:userid" element={<AllMyServices />} />
      <Route path="/Curriculo/:userid" element={<Curriculo />} />
      <Route path="/Servicos" element={<Servicos />} />
      <Route path="/Fotos/:userid" element={<Fotos/>} />
      <Route path="/Notificacoes" element={<Notificacoes />} />
      <Route path="/CriarPost" element={<CriarPost/>} />
      <Route path="/EsqueciSenha" element={<EsqueciSenha/>} />
      <Route path="/CriarServico" element={<CriarServico/>} />
      <Route path="/CurriculoForm" element={<CurriculoForm />} />
      <Route path="/ChatApp/:userid" element={<ChatApp />} />
      <Route path="/conversas" element={<Conversations />} />
      <Route path="/PrestadorServico" element={<PrestadorServico />} />

      <Route path="/AdminLayout" element={<AdminLayout />} />
      <Route path="/Prestadores" element={<Prestadores />} />
      <Route path="/Profissoes" element={<Profissoes/>} />
      <Route path="/Habilidades" element={<Habilidades/>} />
      <Route path="/Provincias" element={<Provincias/>} />
      <Route path="/Municipios" element={<Municipios/>} />
    </Routes>
  );
}

export default AppRoutes;
