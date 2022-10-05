const controller = {
    index: (req, res) => {
        res.render('index', { title: 'La Visual' })
    }
};

module.exports = controller;