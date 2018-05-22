const { MongoClient, ObjectId } = require('mongodb');
const debug = require('debug')('app:utilController');

exports.setupDB = async function() {
  const url = process.env.DB_URL;
  debug(`attempting to connect to database at ${url}`);
  const dbName = 'tasks';
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });

    debug('attempting to get db object');
    const db = client.db(dbName);

    debug('attempting to get collection object');
    const collection = await db.collection('tasks');
    debug ('returning client & collection');
    return ({client : client, collection : collection})
  } 
  
  catch (e) {
    debug(e);
  }         

};