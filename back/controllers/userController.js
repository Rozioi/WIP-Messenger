const User = require('../models/userModel');


const userController = {
    userList: async (req, res) => {
        const username = req.params.username;
        try {
            const users = await User.userList(username);
            res.status(201).json(users);
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },
    profileUser: async (req,res) => {
        const username = req.params.username;
        try{
            const user = await User.findByUsername(username);
            res.status(201).json(user);
        } catch (e) {
            res.status(500).json({message: e.message})
        }
    },
    userById: async (req,res) =>{
        const id = req.params.id;
        try{
            const user = await User.findById(id);
            res.status(201).json(user);
        } catch (e) {
            res.status(500).json({message: e.message});
        }
    },addToFriend: async (req, res) => {
        const { id, friendId } = req.body;

        // Проверка на null или undefined значений
        if (!id || !friendId) {
            return res.status(400).json({ message: "Id or FriendId cannot be empty or undefined" });
        }

        try {
            // Вызов метода добавления друга
            const response = await User.addToFriend(id, friendId);
            return res.status(201).json(response);
        } catch (e) {
            // Логирование ошибки для отладки
            console.error('Error adding friend:', e);

            // Возвращаем ошибку сервера
            return res.status(500).json({ message: e.message });
        }
    },

    friendListByUserId: async (req,res) => {
      const userId  = req.params.id;
      try{
          const response = await User.friendListByUserId(userId);
          res.status(201).json(response);
      } catch (e) {
          res.status(500).json({message: e.message});
      }
    },
    checkFriendship: async (req, res) => {
        const { userId1, userId2} = req.body;
        try{
            const response  = await User.checkFriendship(userId1,userId2);
            if (response.length > 0){

                res.status(201).json({id: response, message: true});
            } else {
                res.status(201).json({message: false});
            }

        } catch (e) {
            res.status(500).json({message: e.message});
        }
    },
    deleteFriendShip: async (req,res) => {
        const id = req.params.id;
        try{
            const response = await User.deleteFriend(id);
            res.status(201).json(response);
        } catch (e) {
            res.status(500).json({message: e.message})
        }
    },
    editProfile: async (req,res) => {
        const userInfo = req.body;
        try{
            const response = await User.updateInfo(userInfo);
            res.status(201).json(response);
        } catch (e) {
            res.status(500).json({message: e.message})
        }
    }


};

module.exports = userController;