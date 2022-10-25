const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    let type = file.mimetype.startsWith('image/');
    let extencionesAceptadas = [".jpg", ".png", ".gif", ".jpeg"];
    let extencion = path.extname(file.originalname);
    type && extencionesAceptadas.includes(extencion) ? cb(null,true): cb(null,false)};

    const upload = multer({storage : storage, fileFilter: fileFilter});

module.exports = upload;