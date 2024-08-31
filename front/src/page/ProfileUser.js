import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/authContext';
import { IoPersonAddOutline } from 'react-icons/io5';
import { AiOutlineUserDelete } from 'react-icons/ai';
import '../assets/styles/profileUser.css'; // Importing styles

const ProfileUser = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const [isFriend, setIsFriend] = useState(null);
    const [stories, setStories] = useState([]);
    const [idFriendships, setIdFriendShips] = useState(null);
    const { api, user } = useAuth();

    useEffect(() => {
        api.get(`/user/profile/${username}`)
            .then(response => {
                setUserInfo(response.data);
                const userInfos = response.data;
                api.post('/user/check-friendship', { userId1: user.user_id, userId2: response.data.user_id })
                    .then(response => {
                        api.get(`/stories/stories/${userInfos.user_id}`)
                            .then(storyResponse => setStories(storyResponse.data))
                            .catch(error => console.error(error.message));
                        setIsFriend(response.data.message);
                        setIdFriendShips(response.data.id[0].id);
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    }, [username, api, user.user_id]);

    const createChat = () => {
        api.post('/chats/new-chat', { oneUsername: user.username, twoUsername: userInfo.username, oneId: user.user_id, twoId: userInfo.user_id })
            .then(response => alert(response))
            .catch(error => alert(error));
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

    const addToFriend = () => {
        api.post('user/add-friend', { id: user.user_id, friendId: userInfo.user_id })
            .then(response => {
                setIsFriend(true);
                setIdFriendShips(response.data.friendshipId);
            })
            .catch(error => console.error(error));
    };

    const deleteFriend = () => {
        api.delete(`/user/delete/${idFriendships}`)
            .then(response => setIsFriend(false))
            .catch(error => console.error(error));
    };

    const openStory = (storyId) => {
        navigate(`/stories/${storyId}`);
    };

    return (
        <div className="profile-container">
            {user ?
                <div>
                    <div className="profile-header">
                        <div style={{ backgroundImage: `url('${userInfo.banner}')` }} className="profile-info-banner">
                            <img className="profile-picture" src={userInfo.profile_picture} alt="Profile" />
                        </div>
                        <div className="profile-info">
                            <p>{userInfo.first_name} {userInfo.last_name}</p>
                            <p><strong>Username:</strong> {userInfo.username}</p>
                            <p><strong>Bio:</strong> {userInfo.bio}</p>
                            <p><strong>Status:</strong> {userInfo.is_active ? "Online" : `${dateConvert(userInfo.last_seen)}`}</p>
                        </div>
                    </div>
                    <div className="button-container">
                        <button className="button" onClick={createChat}>Create a chat</button>
                        {isFriend ?
                            <div className="friend-status">
                                <button className="icon-button" onClick={deleteFriend}><AiOutlineUserDelete /></button>
                                <p>Delete a friend</p>
                            </div> :
                            <div className="friend-status">
                                <button className="icon-button" onClick={addToFriend}><IoPersonAddOutline /></button>
                                <p>Add a friend</p>
                            </div>}
                    </div>

                    {/* Stories List */}
                    <div className="stories-list">
                        {stories.map((story) => (
                            <div key={story.id} className="story-card" onClick={() => openStory(story.id)}>
                                <img src={story.file} alt={story.title} className="story-image" />
                            </div>
                        ))}
                    </div>

                </div>
                :
                <div>Loading...</div>
            }
        </div>
    );
};

export default ProfileUser;
