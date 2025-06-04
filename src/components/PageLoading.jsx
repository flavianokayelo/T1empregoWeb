import React, { useEffect, useState } from 'react';

const PageLoading = () => {
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowReload(true);
    }, 40000); // 40 segundos

    return () => clearTimeout(timer);
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <>
      <style>{`
        :root {
          --primary-color: #4285F4;
          --secondary-color: #225b79;
        }
        .loading-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #f5f8fb;
          color: var(--secondary-color);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 1rem;
          text-align: center;
        }
        .spinner {
          margin: 1.5rem 0;
          width: 60px;
          height: 60px;
          border: 6px solid var(--primary-color);
          border-top: 6px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .loading-text {
          font-size: 1.5rem;
          font-weight: 600;
        }
        .reload-button {
          margin-top: 1.5rem;
          padding: 0.6rem 2rem;
          font-size: 1.1rem;
          background-color: var(--primary-color);
          border: none;
          border-radius: 30px;
          color: white;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(66, 133, 244, 0.4);
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .reload-button:hover {
          background-color: var(--secondary-color);
          box-shadow: 0 6px 15px rgba(34, 91, 121, 0.6);
        }
      `}</style>

      <div className="loading-container" role="alert" aria-busy="true">
        <div className="spinner" aria-label="Carregando..."></div>
        <div className="loading-text">Carregando...</div>
        {showReload && (
          <button className="reload-button" onClick={handleReload} aria-label="Recarregar a página">
            Atualizar página
          </button>
        )}
      </div>
    </>
  );
};

export default PageLoading;
