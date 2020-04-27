'use strict';

const data = require('./recipe.json');
const nome = data.map(function(novo) { return novo.name; });
const item = data.map(function(novo) {return (novo.roles.map(function(nova) {return (nova.name)}))});
const recipe = require('./recipe.js');

module.exports = {
    all:function (req, res) {
        res.send({ express: req.body.express});
      },
    data:function (req, res) {
        res.send({ express: nome});
      },
    name:(recipe.name)
};