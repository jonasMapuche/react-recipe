const express = require('express');
const Task = express.Router();
const controllers = require('./controller.js');

Task.route('/')
  .post(controllers.name)
  .purge(controllers.weigth)
  .put(controllers.android)
  .get((req, res) => {
    res.send({ express: 'delete'});
  });
  
module.exports = Task;