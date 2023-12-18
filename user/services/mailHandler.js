const  nodemailer = require('nodemailer');
 const transporter = nodemailer.createTransport({
    pool: true,
    host: "mail.croissant-rouge.org.tn",
    port: 465,
    secure: true, // use TLS
    auth: {
        user: "test.ali@croissant-rouge.org.tn",
        pass: "7gQ.5{*=xwP]",
    },
});

module.exports = transporter