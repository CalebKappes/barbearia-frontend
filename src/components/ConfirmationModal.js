// src/components/ConfirmationModal.js

import React from 'react';

// O modal recebe:
// - isOpen: se ele deve estar visível ou não
// - message: a pergunta a ser feita (ex: "Tem certeza?")
// - onConfirm: a função a ser executada se o usuário clicar em "Sim"
// - onCancel: a função a ser executada se o usuário clicar em "Não"
function ConfirmationModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) {
    return null; // Se não estiver aberto, não renderiza nada
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="btn-confirm">Sim</button>
          <button onClick={onCancel} className="btn-cancel">Não</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;