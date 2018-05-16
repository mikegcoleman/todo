const { MongoClient, ObjectId } = require('mongodb');

exports.editTask = async function (req, res) {
    try {
        console.log('in edit controller');
        const { id } = req.params;
        const url = 'mongodb://localhost:27017';
        const dbName = 'tasks';
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const taskColl = await (db.collection('tasks'));
        const task = await taskColl.findOne({ _id: new ObjectId(id) });
        client.close();
        res.render('editTask', { task, id, title: 'Save Changes' })
    }
    catch (err) {
        console.log(err);
    }
};

exports.commitEdit = async function (req,res) {
    try {
        const { id } = req.params;
        const task = req.body;
        const url = 'mongodb://localhost:27017';
        const dbName = 'tasks';
        const client= await MongoClient.connect(url);
        const db = client.db(dbName);
        const taskColl = await (db.collection('tasks'));
        await taskColl.findOneAndUpdate({ _id: new ObjectId(id) }, task);
        const tasks = await taskColl.find({}).sort( { dueDate: 1 }).toArray();
        client.close();
        res.render('showTasks', {tasks, title: 'ToDo List'}); 
      }
      catch(err) {
        console.log(err);
      }
};
