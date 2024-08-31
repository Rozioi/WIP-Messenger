import React from 'react';
import {Outlet, NavLink} from "react-router-dom";

import SideMenu from "./sideMenu";
import '../assets/styles/layout.css';
const Layout = () => {
        return (
            <div className="layout-container">
                <header className="header">
                    <div  className="side-menu-container">
                        <SideMenu />
                    </div>
                </header>
                <main className="main-content">
                    <Outlet/>
                </main>
            </div>
        );
    }
;

export default Layout;
