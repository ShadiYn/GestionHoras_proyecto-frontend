import React from "react";
import "../app/Modal.css";

const Modal = ({ show, onClose, title, children, message, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <div>{children}</div>
        <div>{message}</div>
        <button className="modal-button confirm" onClick={onConfirm}>
          Confirm
        </button>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
