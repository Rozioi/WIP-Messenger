const storiesService = require('../service/storiesService');

exports.createStories = async (req,res) => {
    const {authorId,title, description,file, fileGlobal} = req.body;
    try{
        const response = await storiesService.createStories(authorId, title ,description,file,fileGlobal,'image');
        res.json(response);
    }catch (e) {
        res.status(500).send("Error when creating a story")
    }
};
exports.getStoriesByUserId = async (req,res) => {
    const authorId = req.params.userId;
    try{
        const response = await storiesService.getStoriesByUserId(authorId);
        res.json(response);
    }catch (e) {
        res.status(500).send("Error when creating a story")
    }
};
exports.getStoriesById = async (req,res) => {
    const id = req.params.id;
    try{
        const response = await storiesService.getStoriesById(id);
        res.json(response);
    }catch (e) {
        res.status(500).send("Error when creating a story")
    }
};

