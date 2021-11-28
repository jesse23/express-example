const { createLogger: createLoggerWinston, transports, format } = require( 'winston' );

const createLogger = ( name ) => createLoggerWinston( {
  format: format.combine(
    format.timestamp( { format: 'YYYY-MM-DD HH:mm:ss:ms' } ),
    format.printf( info => `[${info.timestamp} ${info.level}] - ${name}: ${info.message}` )
  ),
  transports: [
  /*
    new transports.File({
      filename: './logs/all-logs.log',
      json: false,
      maxsize: 5242880,
      maxFiles: 5,
    }),
  */
    new transports.Console(),
  ]
} );

module.exports = createLogger;
