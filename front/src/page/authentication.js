import React, { useState } from 'react';
import axios from 'axios';
import '../assets/styles/pageAuthentication.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/authContext';

const Authentication = () => {
    const { setUser, user, checkAuth } = useAuth();
    const navigate = useNavigate();
    const { api } = useAuth();
    const [isLoginPage, setIsLoginPage] = useState(true); // По умолчанию на странице входа
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [responseText, setResponseText] = useState('');

    const submitHandle = (e) => {
        e.preventDefault();
        if (isLoginPage) {
            api.post('/auth/login', { username, password })
                .then(response => {
                    const tokens = response.data.tokens;
                    document.cookie = `authToken=${tokens.refreshToken}; path=/; secure; SameSite=Lax;`;
                    localStorage.setItem('token', tokens.accessToken);
                    setUser(response.data.user);
                    setResponseText('Вход успешно выполнен');
                    setTimeout(() => {
                        if (checkAuth()) {
                            navigate('/');
                        }
                    }, 1000);
                })
                .catch(error => setResponseText(error.response.data.message));
        } else {
            api.post('/auth/register', { username, password, firstName, lastName })
                .then(response => setResponseText(response.data))
                .catch(error => setResponseText(error.response.data.message));
        }
    };

    return (
        <div className="authentication-container">
            {isLoginPage ? (
                <div className="form-container">
                    <form onSubmit={submitHandle}>
                        <div className="input-group">
                            <input
                                type="text"
                                value={username}
                                placeholder="@username"
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                value={password}
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <button type="submit" className="submit-button">Submit</button>
                    </form>
                    <p className="toggle-text" onClick={() => setIsLoginPage(!isLoginPage)}>
                        {isLoginPage ? 'Register' : 'Login'}
                    </p>
                    <p className="response-text">{responseText}</p>
                </div>
            ) : (
                <div className="form-container">
                    <form onSubmit={submitHandle}>
                        <div className="name-container">
                            <input
                                type="text"
                                value={firstName}
                                placeholder="First name"
                                onChange={(e) => setFirstName(e.target.value)}
                                className="input-field"
                            />
                            <input
                                type="text"
                                value={lastName}
                                placeholder="Last name"
                                onChange={(e) => setLastName(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                value={username}
                                placeholder="@username"
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                value={password}
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <button type="submit" className="submit-button">Submit</button>
                    </form>
                    <p className="toggle-text" onClick={() => setIsLoginPage(!isLoginPage)}>
                        {isLoginPage ? 'Register' : 'Login'}
                    </p>
                    <p className="response-text">{responseText}</p>
                </div>
            )}
        </div>
    );
};

export default Authentication;
