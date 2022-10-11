const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

const controller = {
    index: (req, res) => {
        res.send('respond with a resource')
    },
    register: (req, res) => {
        res.render('register')
    },
    processRegister: (req, res) => {
        let idUser = (users[users.length-1].id)+1;
        let datos = req.body;
        let mailDuplicado = null;
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            for (let o of users) {
                if (datos.email == o.email) {
                    mailDuplicado = o;
                    res.render('register', { errormail: {
                        mail: {
                            msg: 'El E-Mail ya está registrado'
                        }
                    } });
                    break;
                }
            };

            if (mailDuplicado == null) {
                let nuevoUser = {
                    "id": idUser,
                    "email": datos.email,
                    "pass": bcrypt.hashSync(datos.pass),
                    "name": datos.name,
                    "direccion": datos.direccion,
                    "piso": datos.piso,
                    "departamento": datos.departamento,
                    "image:": req.file.filename,
                    "ciudad": datos.ciudad,
                    "provincia": datos.provincia,
                    "pais": datos.pais
                };
    
                users.push(nuevoUser);
    
                fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 4), 'utf-8');
    
                res.redirect('/');
            };

        } else {
            res.render('register', { errors: errors.mapped(), oldData: datos })
        }


    },
    login: (req, res) => {
        res.render('login')
    },
    processLogin: (req, res) => {
        let datos = req.body;
        let usuarioALoguearse;
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            for (let o of users) {
                if (datos.email == o.email) {
                    if (bcrypt.compareSync(datos.pass, o.pass)) {
                        usuarioALoguearse = o;
                        break;
                    }
                }
            }
    
            if (usuarioALoguearse == undefined) {
                res.render('login', { error:
                {
                    credencial: {
                        msg: 'Credenciales inválidas'
                    }
                } })
            } else {

                req.session.usuarioLogueado = usuarioALoguearse;

                if (datos.recordame != undefined) {
                    res.cookie('recordame', req.session.usuarioLogueado.email, { maxAge: ((((1000 * 60) * 60) * 24) * 365) })
                }

                res.redirect('/');
            }
        } else {
            res.render('login', { errors: errors.mapped(), oldData: datos });
        }

    },
    logout: (req, res) => {
        req.session.destroy();
        res.clearCookie('recordame')
        res.redirect('/');
    }
};

module.exports = controller;