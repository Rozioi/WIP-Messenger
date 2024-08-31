const pool = require('../config/db');
const { encryptMessage, decryptMessage} = require('./encryptionService')


exports.sendMessage = async (chatId, senderId, content, file) => {
    try {
        let selectedFile = false;
        // Хэширование содержимого сообщения
        const {encryptedMessage, iv} = encryptMessage(content)
        console.log(file);
        if (file){
            selectedFile = true;
        }

        const result = await pool.query(
            `INSERT INTO messages (chat_id, sender_id, content, iv,file, is_file) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *`,
            [chatId, senderId, encryptedMessage, iv,file, selectedFile]
        );
        result.rows[0].content = content;

        return result.rows[0];  // Возвращаем вставленное сообщение
    } catch (e) {
        console.error('Error in sendMessage:', e);
        throw e;  // Пробрасываем ошибку выше для обработки
    }
};
exports.getMessagesByChatId = async (chatId) => {
    try {
        const result = await pool.query(
            `SELECT m.id, m.content, m.sender_id, m.iv, m.created_at, m.file, m.is_file, u.username 
       FROM messages m 
       JOIN users u ON m.sender_id = u.user_id 
       WHERE m.chat_id = $1 
       ORDER BY m.created_at ASC`,
            [chatId]
        );

        return result.rows.map(row => ({
            id: row.id,
            content: decryptMessage(row.content, row.iv),
            sender_id: row.sender_id,
            created_at: row.created_at,
            file: row.file,
            is_file: row.is_file,
            username: row.username
        }));
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw new Error('Could not fetch messages');
    }
};

