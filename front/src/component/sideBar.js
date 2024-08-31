import React, {useEffect, useState} from 'react';
import '../assets/styles/sideBar.css';
import {BsPlusCircleFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import {useAuth} from "../utils/authContext";
import {useNavigate} from "react-router-dom";

const SideBar = ({handleMouseLeave,openMenuForCreateGroup,isOpen }) => {
    const [openProfileMenu, setOpenProfileMenu] = useState(false);
    const {user} = useAuth();
    const [background, setBackground] = useState('');

    const navigate = useNavigate();
    const navigatePage = (url) => {
        navigate(url);
    }
    useEffect(() => {
        if (user.banner) {
            setBackground(user.banner);
        }
    }, [user.banner]);

    return (
        <div
            className={`sidebar ${isOpen ? 'open' : 'closed'}`}
            onMouseLeave={handleMouseLeave}
        >
            <div className="sidebar-content">
                <div className='sidebar-profile-info'
                     style={{ backgroundImage: `url(${background})` }}
                >
                    <div className='sidebar-profile-image'>
                        <img src={user.profile_picture} alt="R"/>
                    </div>
                    <div className='sidebar-profile-name'>
                        <h4 style={{margin: '0', color: "#000000"}}>{user.first_name} {user.last_name}</h4>
                        <p style={{color: "#313131", margin: '0', fontSize: "10px"}}>{user.username}</p>
                        <IoIosArrowDown className={`icon-prof-btn ${openProfileMenu ? 'up' : 'down'}`}
                                        onClick={() => setOpenProfileMenu(!openProfileMenu)}/>
                    </div>

                </div>

                <ul className='sidebar-profile-menu'>
                    <div className={`newAccountAdd ${openProfileMenu ? 'open' : 'closed'}`}>
                        <div className='menu-item-crt'>
                            <BsPlusCircleFill/>
                            <p>Добавить аккаунт</p>
                        </div>
                    </div>
                    <li className='menu-item'>
                        <button onClick={() => navigatePage(`/my-profile/${user.username}`)}>My profile</button>
                    </li>
                    <li className='menu-item'>
                        <button onClick={() => navigatePage('/')}>Chats</button>
                    </li>
                    <li onClick={() => openMenuForCreateGroup()} className='menu-item'>
                        <button >Create a group</button>
                    </li>

                    <li className='menu-item'>
                        <button onClick={() => navigatePage('/my-stories')}>My stories</button>
                    </li>
                    <li className='menu-item'>
                        <button onClick={() => navigatePage('/stories/add')}>Create stories</button>
                    </li>
                    <li onClick={() => navigatePage('/settings')} className='menu-item'>
                        <button>Settings</button>
                    </li>

                </ul>
                {/*<div className="toggle-switch">*/}
                {/*    <input type="checkbox" id="switch"/>*/}
                {/*    <label htmlFor="switch" className="slider"></label>*/}
                {/*</div>*/}


            </div>
        </div>
    );
};

export default SideBar;
