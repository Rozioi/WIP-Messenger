// src/component/Modal.js
import React from 'react';
import '../assets/styles/modal.css';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay-set" onClick={onClose}>
            <div className="modal-content-set" onClick={e => e.stopPropagation()}>
                <span className="close-button-set" onClick={onClose}>&times;</span>
                {children}
            </div>
        </div>
    );
};

export default Modal;
