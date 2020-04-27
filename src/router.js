const express = require('express');
const Task = express.Router();
const controllers = require('./controller.js');

Task.route('/')
  .post(controllers.name)
  .get(controllers.data)
  .put((req, res) => {
    res.send({ express: 'put'});
  })
  .delete((req, res) => {
    res.send({ express: 'delete'});
  });

module.exports = Task;