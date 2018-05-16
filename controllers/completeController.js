const { MongoClient, ObjectId } = require('mongodb');

exports.commitComplete = async function (req, res) {
    try {
        const { id } = req.params;
        console.log(id);
        const url = 'mongodb://localhost:27017';
        const dbName = 'tasks';
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const taskColl = await (db.collection('tasks'));
        const task = await taskColl.findOne({ _id: new ObjectId(id) });
        let status = (task.isComplete == 'false') ? 'true' : 'false';
        await taskColl.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { isComplete: status } });
        const tasks = await taskColl.find({}).sort( { dueDate: 1 }).toArray();
        client.close();
        res.render('showTasks', { tasks, title: 'ToDo List', });
    }
    catch (err) {
        console.log(err);
    }
};
