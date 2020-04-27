const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 4000;
const TaskRoutes = require('./router.js');

app.use(bodyParser.json());
app.use('/api/tasks', TaskRoutes);

app.listen(port, () => console.log(`Listening on port ${port}!`));
