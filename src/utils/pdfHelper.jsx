// src/utils/pdfHelper.js

export async function abrirPdf(nomeDoArquivo, setLoading) {
  try {
    setLoading(true);

    // Caminho relativo onde os PDFs estão localizados na pasta `public`
    const pdfUrl = `/${nomeDoArquivo}`;

    // Abre o PDF em uma nova aba
    window.open(pdfUrl, '_blank');
  } catch (error) {
    console.error('Erro ao abrir PDF:', error);
    alert('Erro ao abrir o documento.');
  } finally {
    setLoading(false);
  }
}
