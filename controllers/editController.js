const util = require('./utilController');
const { ObjectId } = require('mongodb');

exports.editTask = async (req, res) => {
    try {
            const { id } = req.params;
            const dbParams = await util.setupDB();
            const taskColl = dbParams.collection;
            const client = dbParams.client;
            const task = await taskColl.findOne({ _id: new ObjectId(id) });
            client.close();
            res.render('editTask', { task, id, title: 'Save Changes' });
    }
    catch (err) {
        console.log(err);
    }
};

exports.commitEdit = async (req,res) => {
    try {
        const { id } = req.params;
        const task = req.body;
        const dbParams = await util.setupDB();
        const taskColl = dbParams.collection;
        const client = dbParams.client;
        await taskColl.findOneAndUpdate({ _id: new ObjectId(id) }, task);
        const tasks = await taskColl.find({}).sort( { dueDate: 1 }).toArray();
        client.close();
        res.redirect('/'); 
      }
      catch(err) {
        console.log(err);
      }
};
