const express = require('express');
const Task = express.Router();
const controllers = require('./controller.js');

Task.route('/')
  .post(controllers.name)
  .purge(controllers.weigth)
  .get(controllers.android)
  .delete(controllers.estimate)
  .put((req, res) => {
    res.send({ express: 'delete'});
  });
  
module.exports = Task;