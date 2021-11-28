/* eslint-env jest */

const supertest = require( 'supertest' );
const server = require( './app' );
const { PATH_ITEM } = require( './constants' );

describe( 'data-storage-api-node', () => {
  describe( 'PUT', () => {
    test( 'Should return 201 and item for valid PUT', async () => {
      const putResult = await supertest( server )
        .put( PATH_ITEM )
        .send( { name: 'Ada' } )
        .set( 'Accept', 'application/json' )
        .expect( 'Content-Type', /json/ )
        .expect( 201 );
      expect( putResult.body ).toBeTruthy();
      expect( typeof putResult.body ).toBe( 'object' );
      expect( putResult.body ).toHaveProperty( 'uid' );
      expect( typeof putResult.body.uid ).toBe( 'string' );
      expect( putResult.body.uid.length ).toBeGreaterThan( 0 );
      expect( putResult.body ).toHaveProperty( 'size' );
      expect( typeof putResult.body.size ).toBe( 'number' );
      expect( putResult.body.size ).toBeGreaterThan( 0 );
    } );

    test( 'Should return 422 for invalid input', async () => {
      await supertest( server )
        .put( PATH_ITEM )
        .send( { name1: 'Ada' } )
        .set( 'Accept', 'application/json' )
        .expect( 422 );
    } );

    test( 'Should return 422 for invalid input type', async () => {
      await supertest( server )
        .put( PATH_ITEM )
        .send( null )
        .set( 'Accept', 'application/json' )
        .expect( 422 );
    } );
  } );

  describe( 'GET', () => {
    test( 'Should return 200 for valid GET', async () => {
      const putResult1 = await supertest( server )
        .put( PATH_ITEM )
        .send( { name: 'Item1' } )
        .set( 'Accept', 'application/json' )
        .expect( 201 );

      const putResult2 = await supertest( server )
        .put( PATH_ITEM )
        .send( { name: 'Chester' } )
        .set( 'Accept', 'application/json' )
        .expect( 201 );

      expect( putResult1.body.uid ).not.toBe( putResult2.body.uid );

      await supertest( server )
        .get( `${PATH_ITEM}/${putResult1.body.uid}` )
        .expect( 200 )
        .then( response => {
          expect( response.body ).toEqual( { name: 'Item1' } );
        } );

      await supertest( server )
        .get( `${PATH_ITEM}/${putResult2.body.uid}` )
        .expect( 200 )
        .then( response => {
          expect( response.body ).toEqual( { name: 'Chester' } );
        } );
    } );

    test( 'Should return 404 for GET non-existent object', async () => {
      await supertest( server )
        .get( `${PATH_ITEM}/Wd8TxJovR9Fk4Lo3` )
        .expect( 404 );
    } );

    test( 'Should return 422 for GET with invalid input', async () => {
      await supertest( server )
        .get( `${PATH_ITEM}/something` )
        .expect( 422 );
    } );
  } );

  describe( 'DELETE', () => {
    test( 'Should return 200 for valid DELETE', async () => {
      const putResult = await supertest( server )
        .put( PATH_ITEM )
        .send( { name: 'Daisy' } )
        .set( 'Accept', 'application/json' )
        .expect( 201 );

      const hash = putResult.body.uid;

      const deleteResult = await supertest( server )
        .delete( `${PATH_ITEM}/${hash}` )
        .expect( 200 );
      expect( deleteResult.body ).toEqual( 1 );

      await supertest( server )
        .get( `${PATH_ITEM}/${hash}` )
        .expect( 404 );
    } );

    test( 'Should return 404 for DELETE non-existent object', async () => {
      await supertest( server )
        .delete( `${PATH_ITEM}/Wd8TxJovR9Fk4Lo3` )
        .expect( 404 );
    } );

    test( 'Should return 422 for DELETE with invalid input', async () => {
      await supertest( server )
        .delete( `${PATH_ITEM}/rstr` )
        .expect( 422 );
    } );
  } );


  // NOTE: this test should be done at service layer
  describe( 'Race condition', () => {
    test( 'Should still get 200 in GET when DELETE and GET at the same time', async () => {
      const app = supertest( server );

      const putResult = await app.put( PATH_ITEM )
        .send( { name: 'Item1' } )
        .set( 'Accept', 'application/json' )
        .expect( 201 );

      const hash = putResult.body.uid;

      await Promise.all( [
        app.delete( `${PATH_ITEM}/${hash}` )
          .expect( 200 ),
        app.get( `${PATH_ITEM}/${hash}` )
          .expect( 200 )
          .then( response => {
            expect( response.body ).toEqual( { name: 'Item1' } );
          } )
      ] );
    } );
  } );

  test( 'Should return 200 when DELETE and DELETE at the same time', async () => {
    const app = supertest( server );

    const putResult = await app.put( PATH_ITEM )
      .send( { name: 'Item1' } )
      .set( 'Accept', 'application/json' )
      .expect( 201 );

    const hash = putResult.body.uid;

    await Promise.all( [
      app.delete( `${PATH_ITEM}/${hash}` )
        .expect( 200 ),
      app.delete( `${PATH_ITEM}/${hash}` )
        .expect( 200 ),
    ] );
  } );
} );
