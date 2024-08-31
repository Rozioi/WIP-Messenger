const pool = require("../config/db");

exports.getUsersByChatId = async (chatId) => {
    try {
        const result = await pool.query(
            `SELECT u.user_id, u.username, u.first_name,u.last_name, u.profile_picture, u.created_at, u.last_seen, u.is_active 
            FROM users u
            JOIN chat_members cm ON u.user_id = cm.user_id
            WHERE cm.chat_id = $1`,
            [chatId]
        );
        return result.rows;
    } catch (err) {
        console.error('Error retrieving users by chat ID:', err);
        throw err;
    }
};

exports.getChatById = async (chatId) => {
    try {
        const result = await pool.query(
            'SELECT * FROM chats WHERE id = $1', [chatId]
        );
        return result.rows[0];
    } catch (error) {
        console.error(`Error retrieving chat by ID ${chatId}:`, error);
        throw new Error('Failed to retrieve chat. Please try again later.');
    }
}

exports.getUserChats = async (userId) => {
    try {
        const result = await pool.query(
            `SELECT c.id, c.name, c.created_at, c.picture, c.is_group
            FROM chats c
            JOIN chat_members cm ON c.id = cm.chat_id
            WHERE cm.user_id = $1`,
            [userId]
        );
        return result.rows;
    } catch (error) {
        console.error(`Error retrieving chats for user ID ${userId}:`, error);
        throw new Error('Failed to retrieve user chats. Please try again later.');
    }
}
exports.createChat = async (oneUsername, twoUsername, oneId, twoId) => {
    // Проверка на создание чата с самим собой
    if (oneId === twoId) {
        throw new Error('Cannot create a chat with yourself');
    }

    try {
        // 1. Проверка на существование чата между двумя пользователями
        const existingChatResult = await pool.query(
            `SELECT chat_id
            FROM chat_members
            WHERE user_id = $1
            AND chat_id IN (
                SELECT chat_id
                FROM chat_members
                WHERE user_id = $2
                AND is_group = false
            )`,
            [oneId, twoId]
        );

        if (existingChatResult.rows.length > 0) {
            return existingChatResult.rows[0].chat_id;
        }

        // 2. Создаем новый чат и возвращаем его ID
        const result = await pool.query(
            'INSERT INTO chats (name) VALUES ($1) RETURNING id',
            [`@${oneUsername}&@${twoUsername}`]
        );

        const chatId = result.rows[0].id;

        // 3. Добавляем записи в таблицу chat_members для обоих пользователей
        await pool.query(
            'INSERT INTO chat_members (chat_id, user_id) VALUES ($1, $2), ($1, $3)',
            [chatId, oneId, twoId]
        );

        return chatId;
    } catch (error) {
        console.error('Error creating chat:', error);
        throw new Error('Failed to create chat');
    }
};

exports.deleteChat = async (chatId) => {

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Начинаем транзакцию
        // 1. Удаляем сообщение из чата из таблицы messages
        await client.query('DELETE FROM messages WHERE chat_id = $1', [chatId]);
        // 2. Удаляем участников чата из таблицы chat_members
        await client.query('DELETE FROM chat_members WHERE chat_id = $1', [chatId]);

        // 3. Удаляем сам чат из таблицы chats
        await client.query('DELETE FROM chats WHERE id = $1', [chatId]);

        await client.query('COMMIT'); // Завершаем транзакцию

        return { message: 'Chat deleted successfully' };
    } catch (e) {
        await client.query('ROLLBACK'); // Откатываем транзакцию в случае ошибки
        throw new Error('Failed to delete chat');
    } finally {
        client.release(); // Освобождаем клиента
    }
};

exports.getTwoUser = async (chatId, userId,type) => {

    try {
        if (type == 'avatar'){
            const result = await pool.query(
                `SELECT u.profile_picture 
            FROM users u
            JOIN chat_members cm ON u.user_id = cm.user_id
            WHERE cm.chat_id = $1 AND u.user_id <> $2`,
                [chatId, userId]
            );
            return result.rows;
        }else{
            const result = await pool.query(
                `SELECT u.banner 
            FROM users u
            JOIN chat_members cm ON u.user_id = cm.user_id
            WHERE cm.chat_id = $1 AND u.user_id <> $2`,
                [chatId, userId]
            );
            return result.rows;
        }
    } catch (err) {
        console.error('Error retrieving users by chat ID:', err);
        throw err;
    }
};

exports.createGroup = async (groupName, userIds, picture) => {
    if (!userIds || userIds.length < 2) {
        throw new Error('A group must contain at least two users.');
    }

    const client = await pool.connect(); // Подключаемся к базе данных
    try {
        await client.query('BEGIN'); // Начинаем транзакцию

        // 1. Создаем новую запись в таблице "chats" и получаем её ID
        const result = await client.query(
            'INSERT INTO chats (name, is_group, picture) VALUES ($1, $2, $3) RETURNING id',
            [groupName, true, picture]
        );
        const chatId = result.rows[0].id;

        // 2. Генерируем массив значений для вставки
        const chatMembersValues = userIds.map((_, index) => `($1, $${index + 2})`).join(', ');

        // 3. Вставляем всех пользователей в таблицу "chat_members"
        const insertQuery = `INSERT INTO chat_members (chat_id, user_id) VALUES ${chatMembersValues}`;
        await client.query(insertQuery, [chatId, ...userIds]);

        await client.query('COMMIT'); // Подтверждаем транзакцию
        return chatId; // Возвращаем ID созданного чата
    } catch (e) {
        await client.query('ROLLBACK'); // Откатываем транзакцию в случае ошибки
        console.error('Error creating group:', e); // Логируем ошибку
        throw new Error('Failed to create group');
    } finally {
        client.release(); // Возвращаем клиент в пул
    }
};

exports.getGroupMemberCount = async (chatId) => {
    const client = await pool.connect(); // Подключаемся к базе данных
    try {
        const result = await client.query(
            'SELECT COUNT(user_id) AS member_count FROM chat_members WHERE chat_id = $1',
            [chatId]
        );
        return result.rows[0].member_count;
    } catch (e) {
        console.error('Error fetching group member count:', e);
        throw new Error('Failed to fetch group member count');
    } finally {
        client.release(); // Возвращаем клиент в пул
    }
};

exports.addUsersToGroup = async (chatId, userIds) => {
    if (!userIds || userIds.length === 0) {
        throw new Error('No users to add.');
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Начинаем транзакцию

        // 1. Получаем существующих участников группы
        const existingMembersResult = await client.query(
            'SELECT user_id FROM chat_members WHERE chat_id = $1',
            [chatId]
        );
        const existingUserIds = existingMembersResult.rows.map(row => row.user_id);

        // 2. Фильтруем новых пользователей, которых нужно добавить
        const newUserIds = userIds.filter(userId => !existingUserIds.includes(userId));

        if (newUserIds.length === 0) {
            throw new Error('All users are already in the group.');
        }

        // 3. Генерируем массив значений для вставки
        const chatMembersValues = newUserIds.map((userId, index) => `($1, $${index + 2})`).join(', ');

        // 4. Вставляем новых пользователей в таблицу "chat_members"
        const insertQuery = `INSERT INTO chat_members (chat_id, user_id) VALUES ${chatMembersValues}`;
        await client.query(insertQuery, [chatId, ...newUserIds]);

        await client.query('COMMIT'); // Подтверждаем транзакцию
        return newUserIds.length; // Возвращаем количество добавленных пользователей
    } catch (e) {
        await client.query('ROLLBACK'); // Откатываем транзакцию в случае ошибки
        throw new Error('Failed to add users to the group');
    } finally {
        client.release(); // Возвращаем клиент в пул
    }
};
exports.updateGroup = async (chatId, groupName, picture, userIds) => {
    if (!userIds) {
        throw new Error('No users provided.');
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start a transaction

        // 1. Update group name and picture
        const updateGroupQuery = `
            UPDATE chats 
            SET name = $1, picture = $2 
            WHERE id = $3
        `;
        await client.query(updateGroupQuery, [groupName, picture, chatId]);

        // 2. Get existing group members
        const existingMembersResult = await client.query(
            'SELECT user_id FROM chat_members WHERE chat_id = $1',
            [chatId]
        );
        const existingUserIds = new Set(existingMembersResult.rows.map(row => row.user_id));

        // 3. Filter new users to add
        const newUserIds = userIds.filter(userId => !existingUserIds.has(userId));

        // 4. Add new users to the group if any
        if (newUserIds.length > 0) {
            // Generate query parameters
            const chatMembersValues = newUserIds.map((userId, index) => `($1, $${index + 2})`).join(', ');
            const insertQuery = `INSERT INTO chat_members (chat_id, user_id) VALUES ${chatMembersValues}`;
            await client.query(insertQuery, [chatId, ...newUserIds]);
        }

        await client.query('COMMIT'); // Commit the transaction
        return { updated: true, newUsersAdded: newUserIds.length };
    } catch (e) {
        await client.query('ROLLBACK'); // Rollback the transaction on error
        throw new Error('Failed to update the group');
    } finally {
        client.release(); // Release the client back to the pool
    }
};

exports.leaveAGroup = async (chatId, userId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Начинаем транзакцию

        // Удаляем пользователя из группы
        const result = await client.query(
            'DELETE FROM chat_members WHERE chat_id = $1 AND user_id = $2',
            [chatId, userId]
        );

        if (result.rowCount === 0) {
            throw new Error('User not found in the group.');
        }

        await client.query('COMMIT'); // Подтверждаем транзакцию
        return { success: true, message: 'User left the group successfully.' };
    } catch (e) {
        await client.query('ROLLBACK'); // Откатываем транзакцию в случае ошибки
        console.error('Error leaving group:', e.message);
        return { success: false, message: e.message };
    } finally {
        client.release(); // Возвращаем клиент в пул
    }
};
