const express = require( 'express' );
const itemController = require( './item.controller' );
const { PATH_ITEM, DEFAULT_PORT, APP_NAME } = require( './constants' );
const createLogger = require( './logger' );

const app = express();
const port = process.env.PORT || DEFAULT_PORT;
const logger = createLogger( APP_NAME );

app.use( PATH_ITEM, itemController );

if ( require.main === module ) {
  app.listen( ( port ), () => {
    logger.info( `App listening at http://localhost:${port}` );
  } );
}

module.exports = app;
