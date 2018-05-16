const { MongoClient, ObjectId } = require('mongodb');

exports.addTask = function (req, res) {
    res.render('addTask', { title: 'Adding a Task' });
};

exports.saveTask = async function (req, res) {
      try {
        const task = req.body;
        const url = 'mongodb://localhost:27017';
        const dbName = 'tasks';
        const client= await MongoClient.connect(url);
        const db = client.db(dbName);
        const taskColl = await (db.collection('tasks'));
        await taskColl.insertOne(task);
        const tasks = await taskColl.find({}).sort( { dueDate: 1 }).toArray();
        client.close();
        res.render('showTasks', {tasks, title: 'ToDo List'}); 
      }
      catch(err) {
        console.log(err);
      }
    };