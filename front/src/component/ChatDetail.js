import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../assets/styles/chatDetail.css';
import { useAuth } from '../utils/authContext';
import { useWebSocket } from '../utils/WebSocketContext';
import ChatMessage from './chatMessage';
import { BiDotsVerticalRounded } from "react-icons/bi";
import CustomFileInput from './CustomFileInput';
import AddUserToGroupModal from "./addUsertoGroupModal";

const ChatWindow = () => {
    const { chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatInfo, setChatInfo] = useState([]);
    const [chatInfoView, setChatInfoView] = useState(false);
    const { user, api } = useAuth();
    const ws = useWebSocket();
    const [fileId, setFileId] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [statusPicture, setStatusPicture] = useState('');

    useEffect(() => {
        api.get(`/chats/${chatId}`)
            .then(response => {
                const chatInfo = response.data;
                if (!chatInfo.is_group) {
                    // Если это не группа, загружаем информацию о другом пользователе
                    api.get(`/chats/${chatId}/members`)
                        .then(response => {
                            const newInfo = response.data.filter(usere => usere.user_id !== user.user_id);
                            setChatInfo(newInfo);
                            setChatInfoView(true);

                            // Загружаем сообщения
                            return api.get(`/messages/${chatId}/messages`);
                        })
                        .then(response => setMessages(response.data))
                        .catch(error => console.error('Error fetching chat info or messages:', error));
                } else {
                    // Если это группа, загружаем количество участников и добавляем к chatInfo
                    api.get(`/chats/group/membersCount/${chatId}`)
                        .then(response => {
                            const updatedChatInfo = {
                                ...chatInfo,
                                memberCount: response.data, // Предполагается, что API возвращает количество участников в поле count
                            };
                            console.log(updatedChatInfo);
                            setChatInfo([updatedChatInfo]);
                            setChatInfoView(true);

                            // Загружаем сообщения
                            return api.get(`/messages/${chatId}/messages`);
                        })
                        .then(response => setMessages(response.data))
                        .catch(error => console.error('Error fetching group members or messages:', error));
                }
            })
            .catch(error => console.error('Error fetching chat info:', error));
    }, [chatId, api, user.user_id]);


    useEffect(() => {
        if (ws) {
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.type === 'status') {
                    // Обновляем статус участников
                    setChatInfo(prevChatInfo =>
                        prevChatInfo.map(user =>
                            user.user_id === data.userId
                                ? { ...user, is_active: data.isOnline, last_seen: new Date() }
                                : user
                        )
                    );
                    console.log(`User ${data.userId} is now ${data.isOnline ? 'online' : 'offline'}`);
                } else {
                    // Добавляем новые сообщения
                    setMessages(prevMessages => [...prevMessages, data]);
                }
            };
        }
    }, [ws, chatInfo]);

    const sendMessage = () => {
        if (ws && newMessage.trim()) {

            const message = {
                chatId,
                senderId: user.user_id,
                content: newMessage,
                file: fileId
            };
            ws.send(JSON.stringify(message));
            setNewMessage('');

        }
    };

    const handleFileSelect = async (file) => {
        const formData = new FormData();
        formData.append('profile_picture', file);
        try {
            const response = await api.post('/upload/picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            setFileId(response.data.fileGlobal);
            setStatusPicture('success');
        } catch (error) {
            setStatusPicture('error');
            console.error('Upload error:', error.response ? error.response.data : error.message);
        }
    };

    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const navigate = useNavigate();

    const leaveAGroup = () => {
        const confirmation = window.confirm("Вы уверены, что хотите выйти из этой группы? Это действие нельзя будет отменить.");

        if (confirmation) {
            api.post(`/chats/leave/`, {chatId: chatId, userId: user.user_id})
                .then(response => {
                    if (response.status === 200) {
                        console.log('Chat deleted successfully');
                        window.location.reload();
                        alert('Чат успешно удалён.');
                    }
                })
                .catch(error => {
                    console.error('Error deleting chat:', error);
                    alert('Произошла ошибка при удалении чата. Пожалуйста, попробуйте снова.');
                });
        } else {
            console.log('Deletion cancelled');
        }
    };
    const deleteChat = () => {
        const confirmation = window.confirm("Вы уверены, что хотите удалить этот чат? Это действие нельзя будет отменить.");

        if (confirmation) {
            api.delete(`/chats/delete/${chatId}`)
                .then(response => {
                    if (response.status === 200) {
                        console.log('Chat deleted successfully');
                        window.location.reload();
                        alert('Чат успешно удалён.');
                    }
                })
                .catch(error => {
                    console.error('Error deleting chat:', error);
                    alert('Произошла ошибка при удалении чата. Пожалуйста, попробуйте снова.');
                });
        } else {
            console.log('Deletion cancelled');
        }
    };

    const dateConvert = (date) => {
        const ConvertedDate = new Date(date);

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };

        return ConvertedDate.toLocaleDateString('en-EN', options);
    };
    const [openAddFriend, setOpenAddFriend] = useState(false);


    return (
        <div className="chat-detail-container">
            {chatInfoView && chatInfo.length > 0 ? (
                <div className="chat-info">
                    {chatInfo[0].is_group ? (
                        <>
                            <img onClick={() => setOpenAddFriend(true)} src={chatInfo[0].picture} alt={chatInfo[0].name} />
                            <div onClick={() => setOpenAddFriend(true)}>
                                <p>{chatInfo[0].name}</p>
                                <p>Number of group members {chatInfo[0].memberCount}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <img onClick={() => navigate(`/profile/${chatInfo[0].username}`)} src={chatInfo[0].profile_picture} alt={chatInfo[0].username} />
                            <div onClick={() => navigate(`/profile/${chatInfo[0].username}`)} >
                                <p>{chatInfo[0].first_name} {chatInfo[0].last_name}</p>
                                <p style={{color: "#7D7D7D"}}>{chatInfo[0].is_active ? 'Online' : `${dateConvert(chatInfo[0].last_seen)}`}</p>
                            </div>
                        </>
                    )}
                    <BiDotsVerticalRounded className="chat-info-icon" onClick={() => toggleMenu()} />
                    {openAddFriend && (
                        <AddUserToGroupModal chatId={chatId} isOpen={openAddFriend} onClose={() => setOpenAddFriend(false)}/>
                    )}
                    {menuOpen && (
                        <div className={`chat-menu ${menuOpen ? 'show' : ''}`}>
                            <button onClick={() => deleteChat()}>Delete a chat</button>
                            <hr />
                            <button>Search</button>
                            <hr />
                            {chatInfo[0].is_group && <button onClick={() => leaveAGroup()}>Leave a group</button>}
                            <hr/>
                            <button onClick={() => toggleMenu()}>Close</button>
                        </div>
                    )}
                </div>
            ) : <div></div>}

            <div className="messages-list">
                {messages.map((message, index) => (
                    <ChatMessage
                        key={index}
                        message={message}
                        currentUserId={user.user_id}
                    />
                ))}
            </div>

            <div className="new-message-form">

                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Введите сообщение"
                />
                <CustomFileInput onFileSelect={handleFileSelect} uploadProgress={uploadProgress} />
                <button onClick={sendMessage}>Отправить</button>
            </div>
        </div>
    );
};

export default ChatWindow;
