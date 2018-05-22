const util = require('./utilController');
const { ObjectId } = require('mongodb');
const debug = require('debug')('app:editController');

exports.editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const dbParams = await util.setupDB();
    const task = await dbParams.collection.findOne({ _id: new ObjectId(id) });
    dbParams.client.close();
    res.render('editTask', { task, id, title: 'Save Changes' });
  }

  catch (err) {
    debug(err);
  }
};

exports.commitEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const task = req.body;
    const dbParams = await util.setupDB();
    await dbParams.collection.findOneAndUpdate({ _id: new ObjectId(id) }, task);
    dbParams.client.close();
    res.redirect('/');
  }

  catch (err) {
    debug(err);
  }
};
