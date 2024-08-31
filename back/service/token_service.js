const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const tokenService = {
    generationToken: async (payload) => {
        try{
            const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_SECRET, {expiresIn: '1m'});
            const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'});
            await tokenService.saveToken(payload.userId, refreshToken);

            return {
                accessToken,
                refreshToken
            };

        } catch (e) {
            console.error('Ошибка генерации токена:', e)
        }

    },
    saveToken: async (userId,refreshToken,deviceInfo = "Redmi Note 9") => {
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        try{
            await pool.query(
                'INSERT INTO tokens (token, user_id, device_info, expires_at) VALUES ($1,$2,$3,$4)',
                [refreshToken, userId, deviceInfo, expiresAt]
            );
        } catch (e) {
            console.error("Ошибка сохранения токена: ", e);
        }
    },
    removeToken: async (refreshToken) => {
        try{
            await pool.query('DELETE FROM tokens WHERE token = $1', [refreshToken]);
        }catch (e) {
            console.error('Ошибка удаления токена:', e)
        }
    },
    findToken: async (refreshToken) => {
        try{
            const result = await pool.query('SELECT * FROM tokens WHERE token = $1', [refreshToken]);
            return result.rows[0];
        } catch (e) {
            console.error('Ошибка поиска токена:', e)
        }

    }
};

module.exports = tokenService;
