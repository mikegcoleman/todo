const { ObjectId } = require('mongodb');
const util = require('./utilController');
const debug = require('debug')('app:deleteController');

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const dbParams = await util.setupDB();
    const task = await dbParams.collection.findOne({ _id: new ObjectId(id) });
    dbParams.client.close();
    res.render('confirmDelete', { task, title: 'Confirm Delete' });
  }

  catch (err) {
    debug(err);
  }
}

exports.confirmDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const dbParams = await util.setupDB();
    const task = await dbParams.collection.deleteOne({ _id: new ObjectId(id) });
    const tasks = await dbParams.collection.find({}).sort({ dueDate: 1 }).toArray();
    dbParams.client.close();
    res.redirect('/');
  }

  catch (err) {
    debug(err);
  };
};