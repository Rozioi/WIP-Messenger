import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import '../assets/styles/chatList.css';
import { useAuth } from "../utils/authContext";

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [banners, setBanners] = useState({});
    const [profilePictures, setProfilePictures] = useState({});
    const { api, user } = useAuth();
    const navigate = useNavigate();
    const [findedUsers, setFindedUsers] = useState(null);

    const setActive = ({ isActive }) => `chat-item ${isActive ? "active" : ""}`;

    useEffect(() => {
        const id = user.user_id;

        // Запрос для получения списка чатов
        api.get(`/chats/user/${id}`)
            .then(response => {
                // Фильтрация уникальных чатов по их `chat_id`
                const uniqueChats = response.data.filter((chat, index, self) =>
                    index === self.findIndex(c => c.id === chat.id)
                );
                setChats(uniqueChats);
                return uniqueChats;
            })
            .then(async (chats) => {
                const bannersData = {};
                const profilePicturesData = {};

                for (let chat of chats) {
                    if (!chat.is_group) { // Если это не группа, загружаем баннер и фото профиля
                        const banner = await getUserBanner(chat.id);
                        const profilePicture = await getUserProfilePicture(chat.id);

                        bannersData[chat.id] = banner;
                        profilePicturesData[chat.id] = profilePicture;
                    } else { // Если это группа, используем фото группы
                        profilePicturesData[chat.id] = chat.picture; // Фото группы
                    }
                }

                setBanners(bannersData);
                setProfilePictures(profilePicturesData);
            })
            .catch(error => {
                console.error('Ошибка при получении чатов:', error);
            });
    }, [user, api]);


    const searchUser = (e) => {
        let username = e.target.value;
        if (username === '') setFindedUsers(null);

        api.get(`/user/search/${username}`)
            .then(response => setFindedUsers(response.data))
            .catch(error => console.error(error));
    };

    const getUserBanner = async (chatId) => {
        try {
            const response = await api.post('/chats/two-user', { chatId, userId: user.user_id, type: 'banner' });
            return response.data[0]?.banner || '';  // Возвращаем баннер
        } catch (error) {
            console.error('Error fetching banner:', error);
            return ''; // Возвращаем пустую строку в случае ошибки
        }
    };

    const getUserProfilePicture = async (chatId) => {
        try {
            const response = await api.post('/chats/two-user', { chatId, userId: user.user_id, type: 'avatar' });
            return response.data[0]?.profile_picture || '';  // Возвращаем фото профиля
        } catch (error) {
            console.error('Error fetching profile picture:', error);
            return ''; // Возвращаем пустую строку в случае ошибки
        }
    };

    return (
        <div className="chat-list-container">
            <div className="chat-container-full">
                <div className="search-div">
                    <input
                        onChange={searchUser}
                        type='text'
                        className='search'
                        placeholder="Search users..."
                    />
                </div>
                {findedUsers && (
                    <div className="search-results">
                        {findedUsers.map((result) => (
                            <div onClick={() => navigate(`/profile/${result.username}`)} key={result.id} className="search-result-item">
                                <img src={result.profile_picture} alt="User Avatar" className="result-item-img" />
                                {result.is_active ? <span className="status-indicator active"></span> :
                                    <span className="status-indicator"></span>}
                                <div className="result-info-container">
                                    <p className="result-item-title">{result.first_name} {result.last_name}</p>
                                    <p className="result-item-username">{result.username}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="chat-list">
                    {chats.map((chat) => (
                        <NavLink
                            to={`/chat/${chat.id}`}
                            key={chat.id}
                            className={setActive}
                            style={{ backgroundImage: chat.is_group ? 'none' : `url(${banners[chat.id] || ''})` }}
                        >
                            <img src={profilePictures[chat.id] || ''} alt="Chat Logo" className="chat-item-img" />
                            <p className="chat-item-title">{chat.name}</p>
                        </NavLink>
                    ))}
                </div>
            </div>
            <div className="chat-outlet">
                <Outlet />
            </div>
        </div>
    );
};

export default ChatList;
