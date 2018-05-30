const util = require('./utilController');
const { MongoClient } = require('mongodb');
const os = require("os");
const debug = require('debug')('app:showController');


exports.showTasks = async function (req, res) {
  try {
    const dbParams = await util.setupDB();
    const tasks = await dbParams.collection.find({}).sort({ dueDate: 1 }).toArray();
    const hostname = os.hostname();
    res.render('showTasks', { tasks, title: 'ToDo List', hostname });
    dbParams.client.close();
  }
  
  catch (err) {
    debug(err);
  }
}