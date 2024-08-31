const pool = require("../config/db");

exports.createStories = async (authorId,title, description,file,fileGlobal,type) => {
    try {
        const result = await pool.query(
            'INSERT INTO stories (author_id,title, description, file, type,file_global) VALUES ($1,$2,$3,$4,$5,$6)',
            [authorId,title , description,file,type,fileGlobal]
        )
        return result.rows;
    } catch (err) {
        console.error('Error when creating a story:', err);
        throw err;
    }
};
exports.getStoriesByUserId = async (authorId) => {
    console.log(authorId);
    try {
        const result = await pool.query(
            'SELECT * FROM stories WHERE author_id = $1',
            [authorId]
        )
        return result.rows;
    } catch (err) {
        console.error('Error when receiving the history:', err);
        throw err;
    }
};
exports.getStoriesById = async (id) => {
    console.log(id);
    try {
        const result = await pool.query(
            'SELECT * FROM stories WHERE id = $1',
            [id]
        )
        return result.rows;
    } catch (err) {
        console.error('Error when receiving the history:', err);
        throw err;
    }
};

