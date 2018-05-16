const { ObjectId } = require('mongodb');
const util = require('./utilController');

exports.deleteTask = async function(req, res){
      try {
        const { id } = req.params;
        const dbParams = await util.setupDB();
        const taskColl = dbParams.collection;
        const client = dbParams.client;
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
        const dbParams = await util.setupDB();
        const taskColl = dbParams.collection;
        const client = dbParams.client;
        const task = await taskColl.deleteOne({ _id: new ObjectId(id)} );
        const tasks = await taskColl.find({}).sort( { dueDate: 1 }).toArray();
        client.close();
        res.render('showTasks', {tasks, title: 'ToDo List'}); 
      }
      catch(err) {
        console.log(err);
      };
  };