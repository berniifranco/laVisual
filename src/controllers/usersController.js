const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const sharp = require('sharp');
const { validationResult } = require('express-validator');

let db = require('../database/models');

const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

function generarId () {
    let idUser;
    if (users.length != 0) {
        idUser = (users[users.length-1].id)+1;
    } else {
        idUser = 1;
    };
    return idUser
};

const controller = {
    detail: (req, res) => {
        db.Persona.findByPk(req.params.id)
            .then(function(usuario) {
                res.render('userDetail', {title: 'Perfil de Usuario', usuario})
            })
    },
    list: (req, res) => {
        db.Persona.findAll({
            include: [{association: 'rol'}]
        })
            .then(function(users) {
                res.render('users', {title: 'Listado de Usuarios', users})
            })
    },
    register: (req, res) => {
        let idBus = null;
        res.render('register', { id: idBus })
    },
    processRegister: async(req, res) => {
        let idBus = null;
        let datos = req.body;
        let errors = validationResult(req);
        db.Persona.findAll()
            .then(function(users) {
                db.Persona.create({
                    nombre: datos.name,
                    usuario: datos.user,
                    email: datos.email,
                    contrasena: bcrypt.hashSync(datos.pass),
                    direccion: datos.direccion,
                    ciudad: datos.ciudad,
                    provincia: datos.provincia,
                    pais: datos.pais,
                    id_empresa: 1,
                    id_rol: 1
                })

                    .then(function(resultado) {
                        res.redirect('/users/login');
                    })
            })
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

        db.Persona.findAll()
            .then(function(persona) {
                db.Persona.findOne({
                    where: {
                        email: datos.email
                    }
                })
                .then(function(resultado) {
                    if (bcrypt.compareSync(datos.pass, resultado.contrasena)) {
                        usuarioALoguearse = resultado;
                    };
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
                            res.cookie('recordame', usuarioALoguearse.id, {maxAge: ((((1000 * 60) * 60) * 24) * 30)})
                        }

                        res.redirect('/');
                    }
                })
                .catch(function(error) {
                    res.render('login', { error:
                        {
                            credencial: {
                                msg: 'Credenciales inválidas'
                            }
                        }, id:idBus })
                })
            })

    },
    logout: (req, res) => {
        req.session.destroy();
        res.clearCookie('recordame')
        res.redirect('/');
    },
    edit: (req, res) => {

        db.Persona.findByPk(req.params.id)
            .then(function(usuario) {
                res.render('form-edit-user', { usuario})
            });
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

    },
    destroy: (req, res) => {
        db.Persona.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(function() {
                res.redirect('/')
            })
        /*let idX = req.params.id;
        let imgBorrar;

        let nuevaListaUsers = users.filter(function(e) {
            return e.id != idX;
        });

        for (let o of users) {
            if (o.id == idX) {
                imgBorrar = o.image;
                break;
            };
        };

        req.session.destroy();
        res.clearCookie('recordame');

        fs.unlinkSync(path.join(__dirname, '../../public/images/users', imgBorrar));

        fs.writeFileSync(usersFilePath, JSON.stringify(nuevaListaUsers, null, 4), 'utf-8');

        res.redirect('/');*/

    }
}


module.exports = controller;