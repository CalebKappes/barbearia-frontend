import React from 'react';

function ConfirmationModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) {
    return null;
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