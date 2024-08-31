import React, { useEffect, useState } from 'react';
import '../assets/styles/modalGroup.css';
import { useAuth } from "../utils/authContext";

const CreateGroupModal = ({ isOpen, onClose }) => {
    const { api, user } = useAuth();
    const [groupName, setGroupName] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [fileId, setFileId] = useState(null);
    const [friends, setFriends] = useState([]);

    // Fetch friends list when modal opens
    useEffect(() => {
        if (isOpen) {
            api.get(`/user/friend-list/${user.user_id}`)
                .then(response => setFriends(response.data))
                .catch(error => console.error(error));
        }
    }, [isOpen, api, user.user_id]);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.error('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('profile_picture', file);

        try {
            const response = await api.post('/upload/picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setFileId(response.data.message);
        } catch (error) {
            console.error('Upload error:', error.response ? error.response.data : error.message);
        }
    };

    const handleFriendSelect = (friendId) => {
        setSelectedFriends(prevState =>
            prevState.includes(friendId)
                ? prevState.filter(id => id !== friendId)
                : [...prevState, friendId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalSelectedFriends = [...selectedFriends, user.user_id];

        if (finalSelectedFriends.length < 2) {
            console.log('Selected friends:', finalSelectedFriends);
            alert('Вы должны выбрать как минимум одного друга для создания группы.');
            return;
        }

        // Подготовка данных в виде JSON-объекта
        const groupData = {
            groupName,
            userIds: finalSelectedFriends,
            picture: fileId ? `${fileId}` : null
        };

        try {
            const response = await api.post('/chats/create-group', groupData, {
                headers: {
                    'Content-Type': 'application/json', // Устанавливаем Content-Type в JSON
                },
            });

            console.log('Group created:', response.data);
            onClose(); // Закрываем модальное окно после успешного создания
        } catch (error) {
            console.error('Error creating group:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            {isOpen && (
                <div className="modal-content">
                    <span className="close-button" onClick={onClose}>&times;</span>
                    <h2>Create a New Group</h2>
                    <img
                        src={fileId ? `${fileId}` : 'default-image-url.jpg'}
                        alt={'group picture'}
                        style={{ borderRadius: '50%', justifyContent: 'center', width: "150px", height: '150px' }}
                    />
                    <form className={'form-group-parents'} onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Group Name:</label>
                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Group Image:</label>
                            <input type="file" onChange={handleFileSelect} accept="image/*"/>
                        </div>
                        <div className="form-group">
                            <label>Select Friends:</label>
                            <div className="friend-list">
                                {friends.map(friend => {
                                    const isCurrentUser = friend.user_id === user.user_id; // Проверяем, является ли друг текущим пользователем
                                    return (
                                        <div key={friend.user_id} className="friend-item">
                                            <input
                                                type="checkbox"
                                                id={`friend-${friend.user_id}`}
                                                checked={selectedFriends.includes(friend.user_id)}
                                                onChange={() => {
                                                    if (!isCurrentUser) { // Только если это не текущий пользователь
                                                        handleFriendSelect(friend.user_id);
                                                    }
                                                }}
                                                disabled={isCurrentUser} // Отключаем чекбокс, если это текущий пользователь
                                            />
                                            <img src={friend.profile_picture} style={{width: '25px', height: '25px'}}
                                                 alt={friend.username}/>
                                            <label htmlFor={`friend-${friend.user_id}`}>
                                                {friend.username} {isCurrentUser && '(You)'}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <button type="submit">Create Group</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CreateGroupModal;
