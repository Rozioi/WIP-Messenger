const path = require('path');

const uploadController = {
    uploadProfilePicture: (req,res) => {
         if (!req.file){
             return res.status(400).send({message: "Изображение не загружено"});
         }
         const fileId = req.file.filename;
         res.send({ file: `http://localhost:8000/upload/${fileId}`, fileGlobal: `http://192.168.1.10:8000/upload/${fileId}`});
    },
    downloadProfilePicture: (req, res) => {
        const { filename } = req.params;

        if (!filename) {
            return res.status(400).send({ message: "Данный файл отсутствует" });
        }

        const filePath = path.join(__dirname, '..', 'uploads', filename);

        res.download(filePath, (err) => {
            if (err) {
                console.error('Ошибка при скачивании файла:', err);
                return res.status(500).send('Ошибка при скачивании файла.');
            }
        });
    }


};

module.exports = uploadController;
