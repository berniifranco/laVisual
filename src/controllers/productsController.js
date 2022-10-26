const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const ferreteriaFilePath = path.join(__dirname, '../data/ferreteriaDataBase.json');
const ferreteria = JSON.parse(fs.readFileSync(ferreteriaFilePath, 'utf-8'));
const { validationResult } = require('express-validator');

function generarIdProd () {
    let nuevoId;
    if (ferreteria.length != 0) {
        nuevoId = (ferreteria[ferreteria.length-1].id)+1;
    } else {
        nuevoId = 1;
    };
    return nuevoId;
};

const controller = {
    ferreteria: (req, res) => {
        let idUser = null;

        if (req.session.usuarioLogueado != undefined) {
            idUser = req.session.usuarioLogueado.id;
        }

        const ferreteria = JSON.parse(fs.readFileSync(ferreteriaFilePath, 'utf-8'));
        res.render('products', { title: 'Ferretería', id: idUser, productos: ferreteria })
    },
    create: (req, res) => {
        let idUser = null;

        if (req.session.usuarioLogueado != undefined) {
            idUser = req.session.usuarioLogueado.id;
        };

        res.render('product-create-form', { id: idUser })
    },
    store: async(req, res) => {
        let datos = req.body;
        let errors = validationResult(req);

        let idUser = null;

        if (req.session.usuarioLogueado != undefined) {
            idUser = req.session.usuarioLogueado.id;
        };

        if (errors.isEmpty()) {
            let img = `${'product-'}${Date.now()}${path.extname(req.file.originalname)}`;
            await sharp(req.file.buffer).resize(166, 37, {fit: "fill" , background:'#fff'}).jpeg({quality: 50, chromaSubsampling: '4:4:4'})
            .toFile(path.join(__dirname, '../../public/images/products/') + img);
            let nuevoProducto = {
                "id": generarIdProd(),
                "name": datos.name,
                "price": parseInt(datos.price),
                "stock": parseInt(datos.stock),
                "tipo": datos.tipo,
                "image": img
            };
    
            ferreteria.push(nuevoProducto);
    
            fs.writeFileSync(ferreteriaFilePath, JSON.stringify(ferreteria, null, 4), 'utf-8');
    
            res.redirect('/products/ferreteria');
        } else {
            res.render('product-create-form', { errors: errors.mapped(), id: idUser, oldData: datos })
        }

    },
    delete: (req, res) => {
        let idBus = req.params.id;

        let imageX;
        
        let nuevaLista = ferreteria.filter(function(e) {
            return e.id != idBus
        });

        for (let o of ferreteria) {
            if (o.id == idBus) {
                imageX = o.image;
                break;
            };
        };

        fs.unlinkSync(path.join(__dirname, '../../public/images/products', imageX));

        fs.writeFileSync(ferreteriaFilePath, JSON.stringify(nuevaLista, null, 4), 'utf-8');

        res.redirect('/products/ferreteria');
    }
};

module.exports = controller;