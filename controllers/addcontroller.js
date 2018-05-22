const { MongoClient, ObjectId } = require('mongodb');
const util = require('./utilController');

exports.addTask = function (req, res) {
    res.render('addTask', { title: 'Adding a Task' });
};

exports.saveTask = async (req, res) => {
      try {
        const task = req.body;
        const dbParams = await util.setupDB();
        const taskColl = dbParams.collection;
        const client = dbParams.client;
        await taskColl.insertOne(task);
        const tasks = await taskColl.find({}).sort( { dueDate: 1 }).toArray();
        client.close();
        //res.render('showTasks', {tasks, title: 'ToDo List'}); 
        res.redirect('/');
      }
      catch(err) {
        console.log(err);
      }
    };