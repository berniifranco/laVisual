const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'berniifranco@gmail.com',
        pass: 'gtpadckwoztehhvu'
    }
});

const mailOptions = {
    from: 'berniifranco@gmail.com',
    to: 'by_bernii@outlook.com',
    subject: 'Prueba Nodemailer',
    text: 'Esta es una prueba de NodeMailer'
};

transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log('Correo envíado: ' + data.response);
    }
});