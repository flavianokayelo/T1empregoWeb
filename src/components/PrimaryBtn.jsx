
import React from "react";
import '../styles/primaryBtn.css'
export default function PrimaryBtn({ onClick, children, type = "button", }) {
  return (
    <div className="create-row">
      <button type={type} className="create-button" onClick={onClick}>
        {children}
      </button>
    </div>
  );
}
