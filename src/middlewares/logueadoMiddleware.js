function logueadoMiddleware (req, res, next) {
    if (req.session.usuarioLogueado) {
        res.send('Ya estás llogueado')
    } else {
        next()
    };
};

module.exports = logueadoMiddleware;