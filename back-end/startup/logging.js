const winston = require('winston');
require ('winston-mongodb');

module.exports = function (){
   
  const logger = winston.createLogger({
    exceptionHandlers:[
      new winston.transports.Console({ colorize: true, prettyPrint: true }),
      new winston.transports.File({
        filename:'uncaughtExceptions.log'
      })
    ],
    rejectionHandlers:[
      new winston.transports.Console({ colorize: true, prettyPrint: true })
    ]
    ,
    transports:[
      new winston.transports.Console({
        filename:'logfile.log',
        level:'error'
      }),
      new winston.transports.File({
        filename:'logfile.log',
        level:'error'
      }),
      new winston.transports.Console({
        level:'info'
      }),
    ],

  });
  global.logger = logger ;
    }