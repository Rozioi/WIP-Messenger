import React, {useState} from 'react';
import {BsList, BsFolderFill} from "react-icons/bs";
import SideBar from "./sideBar";
import '../assets//styles/sideMenu.css';
import CreateGroupModal from "./CreateGroupModal";


const SideMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleMouseLeave = () => {
        setIsOpen(false);
    };
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    const openMenuForCreateGroup =() => {
        setIsModalOpen(true);

    };
    return (
        <div className='side-menu'>

                <BsList className="menu-icon" onClick={toggleSidebar}/>
                <SideBar
                    className="sidebar"
                    openMenuForCreateGroup={openMenuForCreateGroup}
                    handleMouseLeave={handleMouseLeave}
                    isOpen={isOpen}
                />
            {isModalOpen &&
            <CreateGroupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />}


        </div>
    );

};

export default SideMenu;
