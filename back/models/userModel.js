const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const User = {
    createUser: async (userData) => {
        const { username, password, firstName, lastName } = userData;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const result = await pool.query(
            'INSERT INTO users (username, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, passwordHash, firstName, lastName]
        );
        return result.rows[0];
    },
    findByUsername: async (username) => {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0];
    },
    findById: async (id) => {
        const result = await pool.query('SELECT username FROM users WHERE user_id = $1', [id]);
        return result.rows[0];
    },
    isUsernameTaken: async (username) => {
        const result = await pool.query('SELECT 1 FROM users WHERE username = $1', [username]);
        return result.rowCount > 0;
    },
    userList: async (username) => {
        const result = await pool.query(
            "SELECT user_id, username, profile_picture,first_name,last_name, bio, banner,last_seen,is_active FROM users WHERE username ILIKE $1",
            [`%${username}%`]
        );
        return result.rows;
    },
    addToFriend: async (id, friendId) => {
        // Проверка на существующую дружбу
        const checkResult = await pool.query(
            `SELECT id FROM friendships
         WHERE (user_id = $1 AND friend_id = $2)
         OR (user_id = $2 AND friend_id = $1)
         AND status = 'accepted'`,
            [id, friendId]
        );

        // Если запись уже существует, возвращаем сообщение или данные о дружбе
        if (checkResult.rows.length > 0) {
            return { message: 'Friendship already exists', friendshipId: checkResult.rows[0].id };
        }

        // Если записи нет, добавляем новую запись о дружбе
        const result = await pool.query(
            "INSERT INTO friendships (user_id, friend_id, status) VALUES ($1, $2, 'accepted') RETURNING id",
            [id, friendId]
        );

        // Возвращаем ID новой записи о дружбе
        return { friendshipId: result.rows[0].id, message: 'Friendship created successfully' };
    },
    friendListByUserId: async (userId) => {
        // Сначала получаем список всех дружб для данного пользователя
        const result = await pool.query(
            `SELECT 
            CASE 
                WHEN user_id = $1 THEN friend_id 
                ELSE user_id 
            END AS friend_id
         FROM friendships
         WHERE (user_id = $1 OR friend_id = $1)
         AND status = 'accepted'`,
            [userId]
        );

        const friendIds = result.rows.map(row => row.friend_id);

        // Если друзей нет, возвращаем пустой массив
        if (friendIds.length === 0) {
            return [];
        }

        // Теперь получаем данные о друзьях
        const friendsDataResult = await pool.query(
            `SELECT user_id, username, profile_picture
         FROM users
         WHERE user_id = ANY($1::int[])`,
            [friendIds]
        );

        return friendsDataResult.rows;
    },


    checkFriendship: async (userId1, userId2) => {
        const result = await pool.query(
            `SELECT id FROM friendships
         WHERE (user_id = $1 AND friend_id = $2)
         OR (user_id = $2 AND friend_id = $1)
         AND status = 'accepted'`,
            [userId1, userId2]
        );


        return result.rows
    },
    deleteFriend: async (id) => {
        const result = await pool.query(
            'DELETE FROM friendships  WHERE id = $1' , [id]
        );
        return result.rows
    },
    updateInfo: async (userInfo) => {
        const result = await pool.query(
            'UPDATE users SET username = $1, first_name = $2, last_name = $3, bio = $4, profile_picture = $5, banner = $6 WHERE user_id = $7' ,
            [userInfo.username, userInfo.first_name, userInfo.last_name, userInfo.bio, userInfo.profile_picture, userInfo.banner, userInfo.user_id]
        );
        return result.rows
    }



};
module.exports = User;