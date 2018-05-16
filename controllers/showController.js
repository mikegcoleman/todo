const util = require('./utilController');

exports.showTasks = async function(req, res) {
      try{
        const dbParams = await util.setupDB();
        const taskColl = dbParams.collection;
        const client = dbParams.client;
        const tasks = await taskColl.find({}).sort( { dueDate: 1 }).toArray();
        res.render('showTasks', { tasks, title: 'ToDo List', });
        client.close();
      }
      catch(err) {
        console.log(err);
      }
  }