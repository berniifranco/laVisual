var express = require('express');
var router = express.Router();
const path = require('path');
const { body } = require('express-validator');
const upload = require('../middlewares/multerUserMiddleware');
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

/*** VALIDACIONES REGISTRO ***/
const validacionesRegistro = [
    body('email').notEmpty().withMessage('El campo E-Mail no puede estar vacío').isEmail().withMessage('El formato de E-Mail es inválido'),
    body('pass').notEmpty().withMessage('El campo Contraseña no puede estar vacío').isLength({min: 4}).withMessage('La contraseña debe tener mínimo 4 caracteres'),
    body('name').notEmpty().withMessage('El campo Nombre no puede estar vacío'),
    body('direccion').notEmpty().withMessage('El campo Dirección no puede estar vacío'),
    body('ciudad').notEmpty().withMessage('El campo Ciudad no puede estar vacío'),
    body('provincia').notEmpty().withMessage('El campo Provincia no puede estar vacío'),
    body('pais').notEmpty().withMessage('El campo País no puede estar vacío'),
    body('image').custom((value, { req }) => {
        let file = req.file;
        let accept = ['.jpg', '.jpeg', '.gif', '.png'];

        if (!file) {
            throw new Error('Debes subir una imágen')
        } else {
            let fileExtension = path.extname(file.originalname);
            if (!accept.includes(fileExtension)) {
                throw new Error('Los tipos de archivos permitidos son .jpeg, .jpg, .png y .gif')
            }
        };

        return true;

    })
];

let validacionesLogi = [
    body('email').notEmpty().withMessage('El campo E-Mail no debe estar vacío').isEmail().withMessage('El formato de E-Mail es inválido'),
    body('pass').notEmpty().withMessage('El campo Contraseña no debe estar vacío')
];

const usersController = require('../controllers/usersController')

/* GET users listing. */
router.get('/', usersController.index);

router.get('/register', guestMiddleware, usersController.register);
router.post('/register', upload.single('image'), validacionesRegistro, usersController.processRegister);

router.get('/login', usersController.login);
router.post('/login', validacionesLogi, usersController.processLogin);

router.get('/logout', authMiddleware, usersController.logout);

/*** PUREBAS ***/
router.get('/check', function (req, res) {
    if (req.session.usuarioLogueado) {
        res.send('Estás logueado')
    } else {
        res.send('No estás logueado')
    }
})

module.exports = router;
