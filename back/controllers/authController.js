const User = require('../models/userModel');
const tokenService = require('../service/token_service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authController = {
    register: async (req, res) => {
        const {username} = req.body;
        try {
            const isTaken = await User.isUsernameTaken(username);
            if (isTaken) {

                return res.status(400).json({message: "Данный юзернейм уже занят"});
            }
            const newUser = await User.createUser(req.body);
            res.status(201).json("Пользователь зарегистрирован");
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },
    login: async (req, res) => {
        const {username, password} = req.body;
        try {
            const result = await User.findByUsername(username);

            const user = result;
            if (user && await bcrypt.compare(password, user.password_hash)) {
                const tokens = await tokenService.generationToken({userId: user.user_id, username: user.username});
                res.json({
                    tokens: tokens,
                    user: user
                });
            } else {
                res.status(401).send('Неверные учетные данные');
            }
        } catch (e) {
            console.error('Error logging in:', e);
            res.status(500).send('Ошибка при входе')
        }
    },
    logout: async ( req,res) => {
      const { refreshToken } = req.body;
      console.log(refreshToken);
      try{
          await tokenService.removeToken(refreshToken);
          res.status(200).send("Вышел из системы")
      } catch (e) {
          res.status(500).send("Ошибка выхода");
      }
    },
    refreshToken: async (req,res) => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            console.log('No refresh token provided');
            return res.sendStatus(401); // Unauthorized
        }

        console.log('Received refresh token:', refreshToken);

        try {
            // Проверка наличия токена в базе данных
            const tokenData = await tokenService.findToken(refreshToken);

            if (!tokenData) {
                console.log('Refresh token not found in database');
                return res.sendStatus(403); // Forbidden
            }

            // Проверка токена
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
                if (err) {
                    console.log('Refresh token verification failed:', err);
                    return res.sendStatus(403); // Forbidden
                }
                await tokenService.removeToken(refreshToken);
                // Генерация новых токенов
                const tokens = await tokenService.generationToken({ userId: user.userId, username: user.username });

                // Отправка новых токенов
                res.status(200).json(tokens); // Status 200 (OK) и передача новых токенов
            });
        } catch (e) {
            console.error('Error during token refresh:', e);
            res.status(500).send('Ошибка обновления токена'); // Status 500 (Internal Server Error)
        }

    }
};

module.exports = authController;