import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../utils/authContext';
import { IoPersonAdd, IoPersonAddOutline } from 'react-icons/io5';
import { AiOutlineUserDelete } from 'react-icons/ai';
import '../assets/styles/profileUser.css'; // Импортируем стили

const PersonalProfile = () => {
    const { username } = useParams();
    const [userInfo, setUserInfo] = useState({});
    const [isFriend, setIsFriend] = useState(null);
    const [idFriendships, setIdFriendShips] = useState(null);
    const { api, user } = useAuth();

    useEffect(() => {
        api.get(`/user/profile/${username}`)
            .then(response => {
                setUserInfo(response.data);
            })
            .catch(error => console.error(error));
    }, [username, api, user.user_id]);


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

    return (
        <div className="profile-container">
            {user ?
                <div>
                    <div className="profile-header">
                        <div style={{backgroundImage: `url('${userInfo.banner}')`}} className={'profile-info-banner'}>
                            <img className="profile-picture" src={userInfo.profile_picture} alt="Profile"/>
                        </div>
                        <div className="profile-info">
                            <p>{userInfo.first_name} {userInfo.last_name}</p>
                            <p><strong>Username:</strong> {userInfo.username}</p>
                            <p><strong>Bio:</strong> {userInfo.bio}</p>
                            <p>
                                <strong>Status:</strong> {userInfo.is_active ? "Online" : `${dateConvert(userInfo.last_seen)}`}
                            </p>
                        </div>
                    </div>
                    <div className="button-container">

                    </div>
                </div>
                :
                <div>Loading...</div>
            }
        </div>
    );
};

export default PersonalProfile;
