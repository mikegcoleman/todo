const { MongoClient, ObjectId } = require('mongodb');

exports.showTasks = async function(req, res) {
      try{
        const url = 'mongodb://localhost:27017';
        const dbName = 'tasks';
        const client= await MongoClient.connect(url);
        const db = client.db(dbName);
        const taskColl = await (db.collection('tasks'));
        const tasks = await taskColl.find({}).sort( { dueDate: 1 }).toArray();
        res.render('showTasks', { tasks, title: 'ToDo List', });
        client.close();
      }
      catch(err) {
        console.log(err);
      }
  }