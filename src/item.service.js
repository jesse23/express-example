const Datastore = require( 'nedb' );
const { promisify } = require( 'util' );
const { internalIdToUid } = require( './utils' );

const db = new Datastore();

const addItem = async ( createInput ) => {
  return internalIdToUid( await promisify( ( item, cb ) => db.insert( item, cb ) )( {
    ...createInput,
    // NOTE: not sure what does 'size' mean? For not set it as the length of name
    size: createInput.name.length
  } ) );
};

const getItemByUid = async ( uid ) => {
  const res = await promisify( ( item, cb ) => db.find( item, cb ) )( {_id: uid} );
  return  internalIdToUid( res[0] );
};

const deleteItem = uid => {
  return promisify( ( item, cb ) => db.remove( item, cb ) )( {_id: uid} );
};

module.exports = {
  addItem,
  getItemByUid,
  deleteItem
};
