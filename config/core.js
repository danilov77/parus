var cookieSecret = 'KP9GR2uQE3Do3OZMP5Mf6ks9fJMLq8HnCgZPHDJ3';

var coreOptions = {

    cookieSecret: cookieSecret,

    expressSession: {
       resave: false,
       saveUninitialized: true,
       secret: cookieSecret,
       name: '_main' },

    passGen: {
        symbols: 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ%*)?@#$~',
        length_min: 7,
        length_max: 9
    }

}

module.exports = coreOptions