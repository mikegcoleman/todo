const { MongoClient, ObjectId } = require('mongodb');

exports.setupDB = async function() {
    const url = process.env.DB_URL;
    const dbName = 'tasks';
    const client= await MongoClient.connect(url);
    const db = await client.db(dbName);
    const collection = await (db.collection('tasks'));
    
    return ({client : client, collection : collection});
};
