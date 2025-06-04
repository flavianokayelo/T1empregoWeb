import { useState } from "react";
import { IoClose } from "react-icons/io5";

function ModalBiPdf({ userData, modalVisible, setModalVisible }) {
  const [pdfLoading, setPdfLoading] = useState(true);

  if (!modalVisible) return null;

  // Remove "../" do início do caminho
  const biPath = userData.bi_pdf?.replace(/^(\.\.\/)+/, '');
  // URL completa do PDF (mude localhost para seu domínio se precisar)
  const biUrl = `http://localhost/t1/${biPath}`;

  return (
    <div style={styles.modalBackground}>
      <div style={styles.modalContent}>
        <h3 style={styles.modalTitle}>Número do BI</h3>
        <p style={styles.modalBI}>{userData.bi ?? "Não informado"}</p>

        <button
          style={styles.closeButton}
          onClick={() => setModalVisible(false)}
        >
          <IoClose size={24} color="#fff" />
        </button>

        <div style={{ marginTop: 20, height: '80vh', width: '100%' }}>
          {pdfLoading && <p>Carregando documento...</p>}
          <iframe
            src={biUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            onLoad={() => setPdfLoading(false)}
            title="Documento do BI"
          />
        </div>
      </div>
    </div>
  );
}

// Exemplo simples de estilos inline
const styles = {
  modalBackground: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalContent: {
    position: 'relative',
    width: '90%',
    maxWidth: 900,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  modalTitle: {
    margin: 0,
    marginBottom: 10,
  },
  modalBI: {
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#f44336',
    border: 'none',
    borderRadius: '50%',
    width: 32,
    height: 32,
    cursor: 'pointer',
    color: '#fff',
  },
};

export default ModalBiPdf;
