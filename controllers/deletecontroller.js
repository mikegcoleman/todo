const { MongoClient, ObjectId } = require('mongodb');

exports.deleteTask = async function(req, res){
      try {
        const { id } = req.params;
        const url = 'mongodb://localhost:27017';
        const dbName = 'tasks';
        const client= await MongoClient.connect(url);
        const db = client.db(dbName);
        const taskColl = await (db.collection('tasks'));
        const task = await taskColl.findOne({ _id: new ObjectId(id)} );
        client.close();
        res.render('confirmDelete', {task, title: 'Confirm Delete'}); 
      }
      catch(err) {
        console.log(err);
      }
}

exports.confirmDelete = async function(req, res) {
      try {
        console.log('confirming delete');
        const { id } = req.params;
        const url = 'mongodb://localhost:27017';
        const dbName = 'tasks';
        const client= await MongoClient.connect(url);
        const db = client.db(dbName);
        const taskColl = await (db.collection('tasks'));
        const task = await taskColl.deleteOne({ _id: new ObjectId(id)} );
        const tasks = await taskColl.find({}).sort( { dueDate: 1 }).toArray();
        client.close();
        res.render('showTasks', {tasks, title: 'ToDo List'}); 
      }
      catch(err) {
        console.log(err);
      };
  };