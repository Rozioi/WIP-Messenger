import React, {createContext, useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user,setUser] = useState({});
    const  wsUrl = "192.168.1.10";
    const api = axios.create({
        baseURL: "http://192.168.1.10:8000/"
    });
    const checkAuth = () =>{
        const token = localStorage.getItem('token');

        if(token){
            setIsAuthenticated(true);
            return true
        }
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, user,setUser,checkAuth,api,wsUrl}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);
