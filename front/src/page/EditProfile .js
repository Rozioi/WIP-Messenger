import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/authContext';
import '../assets/styles/editProfile.css'; // Import styles

const EditProfile = () => {
    const { api, user } = useAuth();
    const [userInfo, setUserInfo] = useState({
        username: '',
        bio: '',
        profile_picture: '',
        banner: '',
    });

    useEffect(() => {
        if (user) {
            api.get(`/user/profile/${user.username}`)
                .then(response => {
                    setUserInfo(response.data);
                })
                .catch(error => console.error(error));
        }
    }, [user, api]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserInfo(prevState => ({
                    ...prevState,
                    [name]: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        api.put(`/user/profile/`, userInfo)
            .then(response => {
                alert('Profile updated successfully!');
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="set-prof-container">
            <div className="set-prof-scroll-wrapper">
                <h1>Edit Profile</h1>
                {/* Preview Section */}
                <div className="set-prof-preview">
                    <h2>Profile Preview</h2>
                    <div className="set-prof-preview-banner" style={{ backgroundImage: `url(${userInfo.banner})` }}>
                        <img
                            src={userInfo.profile_picture}
                            alt={`Profile picture of ${userInfo.username}`}
                            className="set-prof-preview-picture"
                        />
                    </div>
                    <div className="set-prof-preview-info">
                        <p><strong>Username:</strong> {userInfo.username}</p>
                        <p><strong>Bio:</strong> {userInfo.bio}</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="set-prof-form">
                    <div className="set-prof-field">
                        <label htmlFor="banner">Banner Image URL:</label>
                        <input
                            type="text"
                            id="banner"
                            name="banner"
                            value={userInfo.banner}
                            onChange={handleChange}
                            placeholder="Enter banner image URL"
                        />
                    </div>
                    <div className="set-prof-field">
                        <label htmlFor="profile_picture">Profile Picture URL:</label>
                        <input
                            type="text"
                            id="profile_picture"
                            name="profile_picture"
                            value={userInfo.profile_picture}
                            onChange={handleChange}
                            placeholder="Enter profile picture URL"
                        />
                    </div>
                    <div className="set-prof-field">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={userInfo.username}
                            onChange={handleChange}
                            placeholder="Enter new username"
                        />
                    </div>
                    <div className="set-prof-field">
                        <label htmlFor="first-name">First name:</label>
                        <input
                            type="text"
                            id="first-name"
                            name="first_name"
                            value={userInfo.first_name}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                        />
                        <label htmlFor="last-name">Last name:</label>
                        <input
                            type="text"
                            id="last-name"
                            name="last_name"
                            value={userInfo.last_name}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                        />
                    </div>
                    <div className="set-prof-field">
                        <label htmlFor="bio">Bio:</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={userInfo.bio}
                            onChange={handleChange}
                            placeholder="Enter your bio"
                        />
                    </div>
                    <button type="submit" className="set-prof-submit">Save Changes</button>
                </form>


            </div>
        </div>
    );
};

export default EditProfile;
