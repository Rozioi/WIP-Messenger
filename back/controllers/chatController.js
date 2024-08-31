const chatService = require('../service/chatService');

exports.getUsersByChatId = async (req,res) => {
  const chatId = req.params.id;
  console.log(chatId);
  try{
      const members = await chatService.getUsersByChatId(chatId);
      res.json(members);
  }catch (e) {
      res.status(500).send("Error receiving the members to chat")
  }
};

exports.getChatById = async (req,res) => {
    const chatId = req.params.id;
    console.log(chatId);
    try{
        const chat = await chatService.getChatById(chatId);
        res.json(chat);
    } catch (e) {
        res.status(500).send("Error receiving the chat")
    }
};

exports.getUserChats = async (req,res) => {
    const userId = req.params.id;
    try{
        const chats = await chatService.getUserChats(userId);
        res.json(chats);
    } catch (e) {
        res.status(500).send('Error receiving user chats');
    }
};
exports.createChat = async (req,res) => {
    const {oneUsername, twoUsername, oneId, twoId} = req.body;
    try{
        const chatId = await chatService.createChat(oneUsername,twoUsername,oneId,twoId);
        res.json(chatId);
    } catch (e) {
        res.status(500).send('Error create chat')
    }
};
exports.deleteChat = async (req,res) => {
    const chatId = req.params.id;
    console.log(chatId);
    try{
        await chatService.deleteChat(chatId);
        res.status(200).send('Chat delete')
    } catch (e) {
        res.status(500).send('Error delete chat')
    }
};
exports.getTwoUser = async (req,res) => {
    const {chatId, userId, type} = req.body;
    try{
        const response = await chatService.getTwoUser(chatId, userId,type);
        console.log(response);
        res.json(response);
    } catch (e) {
        res.status(500).send('Error')
    }
};

exports.createGroup = async (req, res) => {
    const { groupName, userIds, picture } = req.body;

    try {
        // Вызов функции создания группы
        const chatId = await chatService.createGroup(groupName, userIds, picture);

        // Возвращаем успешный ответ с ID созданной группы
        return res.status(201).json({ chatId, message: 'Group created successfully' });
    } catch (e) {
        console.error('Error creating group:', e);
        return res.status(500).json({ error: 'Failed to create group' });
    }
};


exports.leaveAGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        return res.status(400).json({ success: false, message: 'chatId and userId are required' });
    }

    try {
        // Вызов функции leaveAGroup из chatService
        const result = await chatService.leaveAGroup(chatId, userId);

        // Проверяем результат и отправляем соответствующий ответ
        if (result.success) {
            return res.status(200).json({ success: true, message: 'User left the group successfully.' });
        } else {
            return res.status(400).json({ success: false, message: 'Failed to leave the group.' });
        }
    } catch (e) {
        console.error('Error leaving group:', e.message);
        return res.status(500).json({ success: false, message: 'An error occurred while trying to leave the group.' });
    }
};

exports.updateGroup = async (req, res) => {
    const { chatId, groupName, picture, userIds } = req.body;


    try {
        // Вызов функции добавления пользователей в группу
        const response = await chatService.updateGroup(chatId, groupName, picture, userIds);

        // Возвращаем успешный ответ с количеством добавленных пользователей
        return res.status(200).json({ response, message: 'Users added to the group successfully' });
    } catch (e) {
        console.error('Error adding users to the group:', e);
        return res.status(500).json({ error: 'Failed to add users to the group' });
    }
};




exports.getChatInfo = async (req, res) => {
    const { chatId } = req.params;

    try {
        // Получаем основную информацию о чате
        const chatInfo = await chatService.getChatById(chatId);
        let memberCount = 0;
        if (chatInfo.is_group) {
            // Если это группа, получаем количество участников
            const memberCountF = await chatService.getGroupMemberCount(chatId);
            memberCount = memberCountF;
        }

        return res.status(200).json(memberCount);
    } catch (e) {
        console.error('Error fetching chat info:', e);
        return res.status(500).json({ error: 'Failed to fetch chat info' });
    }
};
