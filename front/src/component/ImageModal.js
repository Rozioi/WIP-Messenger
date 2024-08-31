// src/components/ImageModal.js
import React from 'react';
import '../assets/styles/ImageModal.css'; // Создайте CSS файл для стилизации модального окна

const ImageModal = ({ src, alt, onClose }) => {
    if (!src) return null; // Если нет источника изображения, ничего не рендерим

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={src} alt={alt} />
                <button className="close-button" onClick={onClose}>X</button>
            </div>
        </div>
    );
};

export default ImageModal;
