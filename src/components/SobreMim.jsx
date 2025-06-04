import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../styles/SobreMim.css";

function SobreMim({ userData }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sobreMim = userData.sobre_mim || "Não informado";

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className="section">
      <h3>Sobre Mim</h3>
      <p className={`sobre-text ${isExpanded ? "expanded" : "clamped"}`}>
        {sobreMim}
      </p>
      {sobreMim.length > 150 && (
        <button onClick={toggleExpanded} className="toggle-button">
          {isExpanded ? (
            <>
              Ver menos <FaChevronUp className="icon" />
            </>
          ) : (
            <>
              Ver mais <FaChevronDown className="icon" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default SobreMim;
