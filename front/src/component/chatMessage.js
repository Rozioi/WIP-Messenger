// src/components/ChatMessage.js
import React, { useEffect, useState } from 'react';
import '../assets/styles/ChatMessage.css';
import { useAuth } from "../utils/authContext";
import ImageModal from './ImageModal'; // Импортируем компонент модального окна

const ChatMessage = ({ message, currentUserId }) => {
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [username, setUsername] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageSrc, setModalImageSrc] = useState('');
    const { api } = useAuth();

    useEffect(() => {
        if (message && currentUserId) {
            const senderId = parseInt(message.sender_id, 10);
            setIsCurrentUser(senderId === currentUserId);

            // Получаем имя пользователя при изменении sender_id
            const fetchUsername = async () => {
                try {
                    const response = await api.get(`/user/user/${message.sender_id}`);
                    setUsername(response.data.username);
                } catch (error) {
                    console.error('Error fetching username:', error);
                }
            };

            fetchUsername();
        }
    }, [message, currentUserId, api]);

    const openModal = (src) => {
        setModalImageSrc(src);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalImageSrc('');
    };
    const convertedDate = (date) => {
        const generatedDate = new Date(date);
        return generatedDate.toLocaleDateString("ru-RU", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div>
            <div className={`message ${isCurrentUser ? 'right' : 'left'}`}>
                <h3>{username}</h3>
                {message.is_file && (
                    <img
                        src={`${message.file}`}
                        alt="uploaded file"
                        onClick={() => openModal(`${message.file}`)}
                    />
                )}
                <p>{message.content}</p>
                <p>{convertedDate(message.created_at)}</p>
            </div>
            {isModalOpen && (
                <ImageModal
                    src={modalImageSrc}
                    alt="Uploaded file"
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default ChatMessage;
