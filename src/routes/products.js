const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

let validacionesProductos = [
    body('name').notEmpty().withMessage('Debes ingresar el nombre del producto'),
    body('price').notEmpty().withMessage('Debes ingresar el precio del producto'),
    body('stock').notEmpty().withMessage('Debes ingresar la cantidad de productos'),
]

const productsController = require('../controllers/productsController');

router.get('/ferreteria', productsController.ferreteria);

router.get('/create', productsController.create);
router.post('/create', validacionesProductos, productsController.store);

router.delete('/delete/:id', productsController.delete);

module.exports = router;