const { PARAM_UID } = require( './constants' );

const uidValidator = ( req, res, next ) => {
  const uid = req.params[PARAM_UID];
  if( typeof uid !== 'string' || uid.length !== 16 ) {
    res.sendStatus( 422 );
  } else {
    next();
  }
};

const internalIdToUid = item => {
  const newItem = item ? {
    ...item,
    uid: item._id
  }: item;
  
  if( newItem ) {
    delete newItem._id;
  }
  
  return newItem;
};

module.exports = {
  uidValidator,
  internalIdToUid,
};
