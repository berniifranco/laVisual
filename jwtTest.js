const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));

const usersFilePath = path.join(__dirname, './src/data/usersDataBase.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

const secretKey = 'Mi llave ultra secreta';
const token = jwt.sign(users[1], secretKey);

app.get('/', (req, res) => {
    res.send(token)
});

app.get('/token', (req, res) => {
    const { token } = req.query;
    jwt.verify(token, secretKey, (err, data) => {
        res.send(err ? 'Token inválido' : data);
    });
});

app.get('/login', (req, res) => {
    const { email, pass } = req.query;
    const user = users.find((u) => u.email == email && bcryptjs.compareSync(pass, u.pass))
    if (user) {
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + 10,
            data: user
        },
        secretKey
    );

    res.send(
        `<a href="/Dashboard?token=${token}"><p>Ir al Dashboard</p></a> Bienvenido, ${email}.
        <script>
        localStorage.setItem('token', JSON.stringify("${token}"))
        </script>
        `);
    } else {
        res.send("Usuario o contraseña incorrecta");
    }
});

app.get('/Dashboard', (req, res) => {
    let { token } = req.query;
    jwt.verify(token, secretKey, (err, decoded) => {
        err ?
            res.status(401).send({
                error: "401 Unauthorized",
                message: err.message
            }) :
            res.send(`
            Bienvenido al Dashboard ${decoded.data.email}
            `);
    });
});