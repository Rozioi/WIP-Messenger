const messageService = require('../service/messageService');

exports.sendMessage = async (req,res) => {
    const { chatId, senderId, content} = req.body;
    try{
        const message = await messageService.sendMessage(chatId,senderId,content);
        res.json(message);
    } catch (e) {
        res.status(500).send('Error sending the message');
    }
};

exports.getMessagesByChatId = async (req,res) => {
    const chatId = req.params.chatId;
    console.log(chatId);
    try{
        const messages = await messageService.getMessagesByChatId(chatId);
        res.json(messages);
    } catch (e) {
        res.status(500).send('Error receiving messages')
    }
};