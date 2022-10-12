const express = require('express');
const fs = require('fs');
const path = require('path');
const ferreteriaFilePath = path.join(__dirname, '../data/ferreteriaDataBase.json');
const ferreteria = JSON.parse(fs.readFileSync(ferreteriaFilePath, 'utf-8'));
const { validationResult } = require('express-validator');


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
    store: (req, res) => {
        let idNuevo = (ferreteria[ferreteria.length-1].id)+1;
        let datos = req.body;
        let errors = validationResult(req);

        let idUser = null;

        if (req.session.usuarioLogueado != undefined) {
            idUser = req.session.usuarioLogueado.id;
        };

        if (errors.isEmpty()) {
            let nuevoProducto = {
                "id": idNuevo,
                "name": datos.name,
                "price": parseInt(datos.price),
                "stock": parseInt(datos.stock),
                "tipo": datos.tipo
            };
    
            ferreteria.push(nuevoProducto);
    
            fs.writeFileSync(ferreteriaFilePath, JSON.stringify(ferreteria, null, 4), 'utf-8');
    
            res.redirect('/products/ferreteria');
        } else {
            res.render('product-create-form', { errors: errors.mapped(), id: idUser, oldData: datos })
        }

    },
    delete: (req, res) => {
        let idBus = req.params.id
        
        let nuevaLista = ferreteria.filter(function(e) {
            return e.id != idBus
        });

        fs.writeFileSync(ferreteriaFilePath, JSON.stringify(nuevaLista, null, 4), 'utf-8');

        res.redirect('/products/ferreteria');
    }
};

module.exports = controller;