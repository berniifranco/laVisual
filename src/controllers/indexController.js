const path = require('path');
const fs = require('fs');

const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

const controller = {
    index: (req, res) => {

        let idUsuarioBuscado = null;

        if (req.session.usuarioLogueado != undefined) {
            for (let o of users) {
                if (o.id == req.session.usuarioLogueado.id) {
                    idUsuarioBuscado = o.id;
                    break;
                }
            }
        };

        res.render('index', { title: 'La Visual', id: idUsuarioBuscado });

    }
};

module.exports = controller;