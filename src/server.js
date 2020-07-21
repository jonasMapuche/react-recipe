const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 4000;
const TaskRoutes = require('./router.js');

app.use(bodyParser.json());
app.use('/api/tasks', TaskRoutes);

console.log('Início teste r-script - 1!!!');

const R = require('r-script');
var out = R("/home/jonas/workspace-r/helloWorld.R").data(100, 2).callSync();
console.log('out <- ' + out);

console.log('Fim teste r-script - 1!!!');
console.log('');

app.listen(port, () => console.log(`Listening on port ${port}!`));
