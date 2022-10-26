const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

function ifAdmin (req, res, next) {
    if (req.session.usuarioLogueado != undefined) {
        if (req.session.usuarioLogueado.email == 'admin@admin.com') {
            res.locals.admin = req.session.usuarioLogueado;
        }
    };

    next();
};

module.exports = ifAdmin