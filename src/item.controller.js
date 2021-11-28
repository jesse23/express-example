const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const { addItem, getItemByUid, deleteItem } = require( './item.service' );
const { PARAM_UID, ITEM_APP } = require( './constants' );
const { uidValidator } = require( './utils' );
const createLogger = require( './logger' );

const jsonParser = bodyParser.json();
const router = express.Router();
const logger = createLogger( ITEM_APP );

router.put( '/', jsonParser, async function ( req, res ) {
  const creatInput = req.body;
  if( !creatInput.name ) {
    res.sendStatus( 422 );
  } else {
    const newItem = await addItem( req.body );
    logger.info( `Item ${JSON.stringify( newItem )} has been created.` );
    res.status( 201 ).json( newItem );
  }
} ); 

router.get( `/:${PARAM_UID}`, uidValidator, async function( req,res ){
  const item = await getItemByUid( req.params[PARAM_UID] );
  if( item ) {
    res.status( 200 ).json( {
      name: item.name
    } );
  } else {
    res.sendStatus( 404 );
  }
} );

router.delete( `/:${PARAM_UID}`, uidValidator, async function( req,res ){
  const item = await getItemByUid( req.params[PARAM_UID] );
  if( item ) {
    const result = await deleteItem( item.uid );
    logger.info( `Item '${item.uid}' has been deleted.` );
    res.status( 200 ).json( result );
  } else {
    res.sendStatus( 404 );
  }
} );

module.exports = router;
