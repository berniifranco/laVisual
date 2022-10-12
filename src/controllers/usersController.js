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
        let idBus = null;
        res.render('register', { id: idBus })
    },
    processRegister: (req, res) => {
        let idUser = (users[users.length-1].id)+1;
        let idBus = null;
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
                    "pass": bcrypt.hashSync(datos.pass, 10),
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
    
                res.redirect('/users/login');
            };

        } else {
            res.render('register', { errors: errors.mapped(), oldData: datos, id: idBus })
        }


    },
    login: (req, res) => {
        let idBuscado = null;
        res.render('login', { id: idBuscado })
    },
    processLogin: (req, res) => {
        let datos = req.body;
        let idBus = null;
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
                }, id:idBus })
            } else {

                req.session.usuarioLogueado = usuarioALoguearse;

                if (datos.recordame != undefined) {
                    res.cookie('recordame', req.session.usuarioLogueado.email, { maxAge: ((((1000 * 60) * 60) * 24) * 365) })
                }

                res.redirect('/');
            }
        } else {
            res.render('login', { errors: errors.mapped(), oldData: datos, id: idBus });
        }

    },
    logout: (req, res) => {
        req.session.destroy();
        res.clearCookie('recordame')
        res.redirect('/');
    },
    edit: (req, res) => {
        let idBuscado = req.params.id;
        let userB = null;
        for (let o of users) {
            if(o.id == idBuscado) {
                userB = o;
                break;
            };
        };

        res.render('form-edit-user', { usuario: userB, id:idBuscado })
    },
    update: (req, res) => {
        let idBus = req.params.id;
        let datos = req.body;

        for (let o of users) {
            if (idBus == o.id) {
                o.name = datos.name;
                o.pass = bcrypt.hashSync(datos.pass, 10);
                o.email = datos.email;
                o.direccion = datos.direccion;
                o.piso = datos.piso;
                o.departamento = datos.departamento;
                o.ciudad = datos.ciudad;
                o.provincia = datos.provincia;
                o.pais = datos.pais;
                break;
            }
        };

        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 4), 'utf-8');

        req.session.destroy();
        res.clearCookie('recordame')

        res.redirect('/');

    }

}


module.exports = controller;