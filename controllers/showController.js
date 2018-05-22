const util = require('./utilController');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:showController');


exports.showTasks = async function(req, res) {
  try{
    debug('calling db setup');
    const dbParams = await util.setupDB();
    debug('db setup complete');
    const tasks = await dbParams.collection.find({}).sort( { dueDate: 1 }).toArray();
    res.render('showTasks', { tasks, title: 'ToDo List', });
    dbParams.client.close();
  }
  catch(err) {
    debug(err);
  }
}