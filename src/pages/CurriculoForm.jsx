import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/CurriculoForm.css';
import Header from '../components/Header';
import RodapeNavegacao from '../components/RodapeNavegacao';
import ModalFeedback from '../components/ModalFeedback';
import { useNavigate } from 'react-router-dom';
import PageLoading from '../components/PageLoading';
const Url = "https://t1emprego.com";
const CurriculoForm = () => {

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    second_number: '',
    bi_number: '',
    bi:'',
    categoria: '',
    profissao: '',
    nacionalidade: '',
    provincia: '',
    municipio: '',
    bairro: '',
    rua: '',
    data_nasc: '',
    disposicao: '',
    sobre_mim: '',
    habilidades: [],
  });

  const [userId, setUserId] = useState(null);
  const [biPdf, setBiPdf] = useState(null);
  const [certificadoPdf, setCertificadoPdf] = useState(null);
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [habilidades, setHabilidades] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [profissoes, setProfissoes] = useState([]);
  const [outroBairro, setOutroBairro] = useState('');
  const[allUserData, setAlluserData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const[logado, setLogado] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const navegar = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setLogado(parsed)

        if (parsed.userid) {
          setUserId(parsed.userid);
        }
      } catch (error) {
        console.error("Erro ao parsear userData:", error);
      }
    }
  }, []);
 
  // buscar as caegorias 

  useEffect(() => {
  // Pega todas as categorias na inicialização
  const fetchCategorias = async () => {
    try {
      const res = await axios.get(`${Url}/api/getCategorias.php`);
      
     
        setCategorias(res.data);
     
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };
  fetchCategorias();
}, []);

// Ao mudar categoria, busca profissões correspondentes
useEffect(() => {
   
  if (!formData.categoria) {
    setProfissoes([]);
    setFormData(prev => ({ ...prev, profissao: '' }));
    return;
  }

  const categoriaSelecionada = categorias.find(cat => cat.nome === formData.categoria);
  

  if (!categoriaSelecionada) {
    setProfissoes([]);
    setFormData(prev => ({ ...prev, profissao: '' }));
    return;
  }

  const fetchProfissoes = async () => {
    try {
      const res = await axios.get(`${Url}/api/getProfissoes.php?categoria_id=${categoriaSelecionada.id}`);
      
        setProfissoes(res.data);
     
    } catch (error) {
      console.error('Erro ao carregar profissões:', error);
      setProfissoes([]);
    }
  };

  fetchProfissoes();

  // Limpa profissão ao mudar categoria
  setFormData(prev => ({ ...prev, profissao: '' }));
}, [formData.categoria, categorias]);

  //mudar o valor do bairo para outro bairo
  useEffect(() => {
  if (outroBairro.trim() !== '') {
    setFormData(prev => ({ ...prev, bairro: outroBairro }));
  }
}, [outroBairro]);

  // console.log(categorias)

  // buscano as provincio 
    useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const response = await axios.get(`${Url}/api/get_provincias.php`);
    
       // console.log(response.data.data)
        if (response.data.success) {
          setProvincias(response.data.data);
        }
      } catch (error) {
        console.error('Erro ao buscar províncias:', error);
      }
    };

    fetchProvincias();
  }, []);

  // bucar os municipio
  useEffect(() => {
  if (!formData.provincia) return;

  const provinciaSelecionada = provincias.find(p => p.nome === formData.provincia);
  if (!provinciaSelecionada) return;

  const fetchMunicipios = async () => {
    try {
      const response = await axios.get(`${Url}/api/get_municipios.php?provincia_id=${provinciaSelecionada.id}`);

     // console.log(response)
      
      if (response.data.success) {
        setMunicipios(response.data.data);
      } else {
        setMunicipios([]);
      }
    } catch (error) {
      console.error('Erro ao buscar municípios:', error);
      setMunicipios([]);
    }
  };

  fetchMunicipios();
}, [formData.provincia]);
//nuscar habilidades
useEffect(() => {
  const fetchHabilidades = async () => {
    try {
      const response = await axios.get(`${Url}/api/getHabilidades.php`);

      setHabilidades(response.data); // deve ser um array de strings ou objetos com { id, nome }

    } catch (error) {
      console.error('Erro ao carregar habilidades:', error);
    }
  };

  fetchHabilidades();
}, []);


// buscando os dados do curriculo
  useEffect(() => {
    if (!userId) return;

    const fetchCurriculo = async () => {
      try {
        const response = await fetch(`${Url}/api/buscar_curriculo.php?userid=${userId}`);
        const result = await response.json();

        if (result.success && result.data) {
          const dados = result.data[0];

         ///console.log(dados);

           setAlluserData(dados);
          setFormData(prev => ({
            ...prev,
            bi_number: dados.bi,
            ...dados,
            habilidades: typeof dados.habilidades === 'string'
              ? dados.habilidades.split(',').map(h => h.trim())
              : Array.isArray(dados.habilidades)
                ? dados.habilidades
                : [],
          }));

         
        }
      } catch (error) {
        console.error("Erro ao buscar currículo:", error);
      }
    };

    fetchCurriculo();
  }, [userId]);

// buscandoso bairros 
useEffect(() => {
   //console.log(formData)

  if (!formData.municipio || municipios.length === 0) return;

  const municipioSelecionado = municipios.find(m => m.nome === formData.municipio);
  if (!municipioSelecionado) return;

  const fetchBairros = async () => {
    try {
      const response = await axios.get(`${Url}/api/get_bairros.php?municipio_id=${municipioSelecionado.id}`);

      //console.log('Bairros recebidos:', response.data); // DEBUG

      setBairros(response.data.map(b => b.nome));
    } catch (error) {
      console.error('Erro ao buscar bairros:', error);
      setBairros([]);
    }
  };

  fetchBairros();

  setFormData(prev => ({
    ...prev,
    bairro: '',
  }));
}, [formData.municipio, municipios]);





  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, tipo) => {
    const file = e.target.files[0];
    if (tipo === 'bi') setBiPdf(file);
    if (tipo === 'certificado') setCertificadoPdf(file);
  };

const handleMultiSelect = (e) => {
  const selected = Array.from(e.target.selectedOptions, (option) => option.value);
  setFormData((prev) => ({
    ...prev,
    habilidades: selected,
  }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // mostra o spinner
    if (!userId) {
      alert("Usuário não autenticado. Faça login novamente.");
      return;
    }

    const payload = new FormData();
    for (const key in formData) {
      if (Array.isArray(formData[key])) {
        payload.append(key, JSON.stringify(formData[key]));
      } else {
        payload.append(key, formData[key]);
      }
    }
     const bairroFinal = formData.bairro === 'Outros' && outroBairro.trim()
        ? outroBairro.trim()
        : formData.bairro;
        payload.append('bairro', bairroFinal);

    if (biPdf) payload.append('bi_pdf', biPdf);
    if (certificadoPdf) payload.append('certificado_pdf', certificadoPdf);
    payload.append('userid', userId);

    try {
      const response = await fetch(`${Url}/api/salvar_curriculo.php`, {
        method: 'POST',
        body: payload,
      });
      const result = await response.json();
      console.log('', result);
      setModalMessage(result.message)
      setModalOpen(true)
      navegar("/Perfil")
    } catch (err) {
      console.error('Erro ao enviar o currículo:', err);
       setModalMessage("Erro ao enviar curriculo !")
      setModalOpen(true)

    }
    finally {
    setIsLoading(false); // esconde o spinner
  }
  };

    //console.log(logado)

if (logado.length === 0) {
  return (
   <PageLoading/>
  );
}

  
  return (
    <div className="form-container">
      <Header isPerfil={true} />
      <h2>Preencher Curriculum Vitae </h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
      <label>Digite o teu nome completo</label>
        <input type="text" name="full_name" placeholder="Nome Completo" value={formData.full_name} onChange={handleInputChange} required />
        {
          /* 
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange}  />

          */
        }
        <label>Digite um segundo número , caso tem</label>
        <input type="text" name="second_number" placeholder="Segundo Número de telefone, alternativo" value={formData.second_number} onChange={handleInputChange}  />

         {
          logado.tipo_conta === "P" &&(
            <>
        <label>Digite o teu número do BI</label>   
        <input
        type="text"
        name="bi_number"
        placeholder="Número do BI"
        value={formData.bi_number} // ou formData.bi_number || ""
        onChange={handleInputChange}
        required
        />


        <label>Carregar BI (PDF)</label>
     {allUserData.bi_pdf ? (
  <div>
    <p>
      Arquivo BI atual: <strong>{allUserData.bi_pdf.split('/').pop()}</strong>
      
    </p>
    <label>
      Alterar arquivo (opcional):
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => handleFileChange(e, 'bi')}
      />
    </label>
  </div>
) : (
  <input
    type="file"
    accept=".pdf"
    onChange={(e) => handleFileChange(e, 'bi')}
    required
  />
)}

            <label>Seleciona a categoria/Area</label>
       <select
        name="categoria"
        value={formData.categoria}
        onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
        required
        >
        <option value="">Selecione a Categoria/Area</option>
       {categorias.map(cat => (
                <option key={cat.id} value={cat.nome}>
                {cat.nome}
                </option>
            ))}
        </select>

            {
            /** enaqu nao adicionei muiats profissao eles mesmo vao digitar
            * 
            *        <select
            name="profissao"
            value={formData.profissao}
            onChange={handleInputChange}
            required
            disabled={profissoes.length === 0}
            >
            <option value="">Selecione a Profissão</option>
            {profissoes.map(prof => (
            <option key={prof.id} value={prof.nome}>{prof.nome}</option>
            ))}
            </select
            * 
            * 
            */
            }
              <label>Digite a tua profissão</label>
            <input type="text" name="profissao" placeholder="Digite a tua profissão" value={formData.profissao || allUserData.profissao} onChange={handleInputChange} required />

        <label>Carregar Certificado da Profissão (PDF)</label>
        <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'certificado')}  />
            </>
          )

         }


        <label>Digite a tua nacionalidade</label>
        <input type="text" name="nacionalidade" placeholder="Nacionalidade" value={formData.nacionalidade} onChange={handleInputChange} required />
           <label>Seleciona a tua província</label>
            <select
            name="provincia"
            value={formData.provincia}
            onChange={(e) => {
                const selectedProvincia = e.target.value;
                setFormData(prev => ({ ...prev, provincia: selectedProvincia }));

             
            }}
            >
            <option value="">Selecione a Província</option>
            {provincias.map(prov => (
                <option key={prov.id} value={prov.nome}>
                {prov.nome}
                </option>
            ))}
            </select>

        <label>Seleciona o teu Município</label>
        <select name="municipio" value={formData.municipio} onChange={handleInputChange} required>
          <option value="">Selecione o Município</option>
          {municipios.map((mun) => (
                    <option key={mun.id} value={mun.nome}>{mun.nome}</option>
                ))}
        </select>
        
          <label>Seleciona o teu Bairro</label>
           <select
        name="bairro"
        value={formData.bairro || allUserData.bairro}
        onChange={(e) => {
            const selectedValue = e.target.value;
            
            setFormData(prev => ({ ...prev, bairro: selectedValue }));
            if (selectedValue !== 'Outros') {
            setOutroBairro('');
            }
            
        }}
        className="border rounded p-2 w-full"
        >
        <option value="">Selecione o bairro</option>
        {bairros.map((bairro, index) => (
            <option key={index} value={bairro}>
            {bairro}
            </option>
        ))}
        <option value="Outros">Outros</option>
        </select>

             {formData.bairro === 'Outros' && (
                <input
                    type="text"
                    name="outro_bairro"
                    placeholder="Digite o nome do bairro"
                    value={outroBairro}
                    onChange={(e) => setOutroBairro(e.target.value)}
                    className="border rounded p-2 w-full mt-2"
                    required
                />
                )}
             {outroBairro !== '' && (
                <input
                    type="text"
                    name="outro_bairro"
                    placeholder="Digite o nome do bairro"
                    value={outroBairro}
                    onChange={(e) => setOutroBairro(e.target.value)}
                    className="border rounded p-2 w-full mt-2"
                    required
                />
                )}

          <label>Digite a localização mais perto da tua casa</label>
        <input type="text" name="rua" placeholder="Rua / Zona" value={formData.rua} onChange={handleInputChange} required />
        <label>Data de nascimento</label>
        <input type="date" name="data_nasc" value={formData.data_nasc} onChange={handleInputChange} required />
        
          
          {
            logado.tipo_conta === "P" &&(
              <>
                <select name="disposicao" value={formData.disposicao} onChange={handleInputChange} required>
          <option value="">Disposição para trabalhar</option>
          <option value="Segunda/Sabado">Segunda/Sabado</option>
          <option value="Segunda/Sexta">Segunda/Sexta</option>
          <option value="Final de Semanas">Final de Smanas</option>
          <option value="Tempo Integral">Tempo Integral</option>
        </select>
            <label>Diz alguma coisa importante sobre você</label>
        <textarea name="sobre_mim" placeholder="Sobre mim" value={formData.sobre_mim} onChange={handleInputChange} rows={4}></textarea>

        <label>Habilidades</label>
<select
  multiple
  name="habilidades"
  value={formData.habilidades}
  onChange={handleMultiSelect}
>
  {habilidades.map((habilidade, index) => {
    const valor = habilidade.nome || habilidade;
    return (
      <option key={index} value={valor}>
        {valor}
      </option>
    );
  })}
</select>


              </>
            )
          }

              <center>
                <button type="submit" disabled={isLoading} className="botao-salvar">
  {isLoading ? (
    <span className="spinner"></span>
  ) : (
    'Salvar Currículo'
  )}
</button>

              </center>
      </form>
        <ModalFeedback
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMessage}
        />


      <RodapeNavegacao />
    </div>
  );
};

export default CurriculoForm;
