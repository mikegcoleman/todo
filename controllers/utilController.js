const { MongoClient, ObjectId } = require('mongodb');
const debug = require('debug')('app:utilController');

exports.setupDB = async function() {
    try {
        const url = process.env.DB_URL;
        const dbName = 'tasks';
        const client= await MongoClient.connect(url);
        const db = await client.db(dbName);
        const collection = await (db.collection('tasks'));
        console.log (`connect to db @ ${ url }`);

        return ({client : client, collection : collection});
    }

    catch(error) { debug(error); }
};
