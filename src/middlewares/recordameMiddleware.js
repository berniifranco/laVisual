const fs = require('fs');
const path = require('path');

const db = require('../database/models');

const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

function recordameMiddleware (req, res, next) {
    if (req.cookies.recordame != undefined && req.session.usuarioLogueado == undefined) {

        db.Persona.findByPk(req.cookies.recordame)
            .then(function(usuario) {
                req.session.usuarioLogueado = usuario.dataValues;
            })

        /*for (let o of users) {
            if (req.cookies.recordame == o.email) {
                usuarioALoguearse = o;
                break;
            }
        };*/

    };

    if (req.session.usuarioLogueado) {
        res.locals.usuarioLogueado = req.session.usuarioLogueado;
    }

    next();
};

module.exports = recordameMiddleware;