import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './authContext';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const { wsUrl, user, isAuthenticated } = useAuth();
    const [ws, setWs] = useState(null);

    useEffect(() => {
        if (isAuthenticated && wsUrl && user) {
            const socket = new WebSocket(`wss://${wsUrl}?userId=${user.user_id}`);
            setWs(socket);

            // Отправляем userId при открытии соединения
            socket.onopen = () => {
                if (user && user.user_id) {
                    const userData = {
                        type: 'connect',  // Тип сообщения, указывающий на подключение пользователя
                        userId: user.user_id,
                    };
                    socket.send(JSON.stringify(userData));
                }
            };

            // Handle WebSocket errors
            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            // Handle WebSocket connection close
            socket.onclose = () => {
                console.log('WebSocket connection closed');
            };

            // Cleanup WebSocket connection on unmount
            return () => {
                socket.close();
            };
        }
    }, [wsUrl, user, isAuthenticated]);

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
