const path = require('fs');
const multer = require('multer');

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/images/products'))
    },
    filename: (req, file, cb) => {
        let imageName = 'product-' + Date.now() + path.extname(file.originalname);
        cb(null, imageName)
    }
});

const upload = multer({storage: diskStorage});

module.exports = upload;