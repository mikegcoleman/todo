const { MongoClient, ObjectId } = require('mongodb');
const util = require('./utilController');

exports.commitComplete = async function (req, res) {
    try {
        const { id } = req.params;
        const dbParams = await util.setupDB();
        const taskColl = dbParams.collection;
        const client = dbParams.client;
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
