require('dotenv').config();
const pool = require("./config/db");
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const uploadProfilePictureRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const storiesRoutes = require('./routes/storiesRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const messageService = require('./service/messageService');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const server = http.createServer(app); // Create HTTP server
const wss = new WebSocket.Server({ server }); // Create WebSocket server with HTTP server
const url = require('url');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/stories', storiesRoutes);
app.use('/upload', uploadProfilePictureRoutes);
app.use('/user', userRoutes)
app.use('/auth', authRoutes);
app.use('/chats', chatRoutes);
app.use('/messages', messageRoutes);


function broadcastUserStatus(userId, isOnline) {
    const message = JSON.stringify({
        type: 'status',
        userId: userId,
        isOnline: isOnline,
    });

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}
// WebSocket connection handling
wss.on('connection', async (ws, req) => {
    // Парсим URL, чтобы извлечь параметры запроса
    const parameters = url.parse(req.url, true).query;
    const userId = parameters.userId;
    console.log('UserId: ', userId);

    if (userId) {
        await pool.query(`UPDATE users SET is_active = TRUE WHERE user_id = $1`, [userId])
            .catch(err => console.error('Ошибка при обновлении статуса:', err));

        ws.userId = userId;

        // Сообщаем всем о том, что пользователь подключился
        await broadcastUserStatus(userId, true);


        ws.on('message', async (message) => {
            try {
                const parsedMessage = JSON.parse(message);
                const { chatId, senderId, content, file } = parsedMessage;
                console.log(file, content);
                // Проверяем, что content не undefined и является непустой строкой
                if (typeof content !== 'string' || !content.trim()) {
                    console.log('Invalid content:', content);
                    return; // Прекращаем обработку некорректного сообщения
                }

                console.log(file, message);

                // Отправляем сообщение
                const newMessage = await messageService.sendMessage(chatId, senderId, content, file);

                // Рассылаем сообщение всем подключенным клиентам
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(newMessage));
                    }
                });
            } catch (err) {
                console.error('Error handling WebSocket message:', err);
            }
        });


        ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
// Обработка разрыва соединения
        ws.on('close', () => {
            pool.query(
                `UPDATE users SET is_active = false, last_seen = NOW() WHERE user_id = $1`,
                [userId]
            )
                .catch(err => console.error('Ошибка при обновлении статуса:', err));

            // Сообщаем всем о том, что пользователь отключился
            broadcastUserStatus(userId, false);
        });

    } else {
        console.error('UserId не был передан в WebSocket соединении');
        ws.close(); // Закрываем соединение, если нет userId
    }
});


const PORT = process.env.PORT || 8000; // Use environment variable for port
server.listen(PORT, () => { // Start HTTP server, which also handles WebSocket
    console.log(`Server running at http://localhost:${PORT}`);
});
