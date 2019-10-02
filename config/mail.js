module.exports = {
    from: 'danilov@tjcollection.ru',
    host: 'tjcollection.ru', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'danilov@tjcollection.ru',
        pass: 'dgthtlhjccbz@2'
    }
}