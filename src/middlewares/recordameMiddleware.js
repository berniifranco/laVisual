const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

function recordameMiddleware (req, res, next) {
    if (req.cookies.recordame != undefined && req.session.usuarioLogueado == undefined) {
        let usuarioALoguearse;

        for (let o of users) {
            if (req.cookie.recordame == o.email) {
                usuarioALoguearse = o;
                break;
            }
        };

        req.session.usuarioLogueado = usuarioALoguearse;

    };

    next();
};

module.exports = recordameMiddleware;