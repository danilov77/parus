var cookieSecret = 'KP9GR2uQE3Do3OZMP5Mf6ks9fJMLq8HnCgZPHDJ3';

var coreOptions = {

  cookieSecret: cookieSecret,

  expressSession: {
     resave: false,
     saveUninitialized: false,
     secret: cookieSecret,
     name: '_main' },

  passGen: {
      symbols: 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ%*)?@#$~',
      length_min: 7,
      length_max: 9 },

	redis: { 
		host: 'localhost', 
		port: 6379, 
		ttl: 86400 },

	filespath: '/root/www/files/images/documm',

	optCroppedCanvas: {
		width: 300,
		height: 300,
	},
  
  resultXHR: {
    result:0,
    message_text: '',
    error: {
      error_code:0,
      error_text:''
    },
    redirect: {
      redirect_time: 0,
      redirect_url: ''
    }
  },
  
}

module.exports = coreOptions