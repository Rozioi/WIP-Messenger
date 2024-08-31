const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'uploads/');
    },
    filename: (req,file,cb) => {
        const uniqueSuffix = uuidv4();
        const extension = path.extname(file.originalname);
        cb(null,uniqueSuffix + extension);
    }


});

const upload = multer({ storage: storage});

module.exports = upload;