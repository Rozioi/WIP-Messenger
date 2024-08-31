import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { RiAccountCircleLine } from "react-icons/ri";
import { IoLanguageSharp } from "react-icons/io5";
import { useAuth } from "../utils/authContext";
import '../assets/styles/setting.css';

const SettingPage = () => {
    const { user } = useAuth();
    return (
        <div className="setting-container">
            <h1 style={{textAlign: 'center'}}>Settings page</h1>
            <div
                className="setting-profile-header"
                style={{ backgroundImage: `url(${user.banner})` }} // Correctly apply the background image
            >
                <div className="setting-profile-picture-container">
                    <img
                        src={user.profile_picture} // Correctly apply the profile picture source
                        alt={`Profile picture of user @${user.username}`}
                        className="setting-profile-picture"
                    />
                </div>
            </div>

            <div className="setting-options">
                <NavLink to="/edit-profile" >
                    <RiAccountCircleLine /> My account
                </NavLink>
                <NavLink to="/settings/language" >
                    <IoLanguageSharp /> Language
                </NavLink>
            </div>
        </div>
    );
};

export default SettingPage;
