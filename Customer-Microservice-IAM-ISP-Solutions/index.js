require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const router = express.Router();

const environment = process.env.NODE_ENV;
const stage = require('./config')[environment];

const routes = require('./src/routes/index');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cors()) // cool now everything is handled!
const helmet = require('helmet');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});


if (environment !== 'production') {
    app.use(logger('dev'));
}

app.use('/api/v1', routes(router));
// app.use('/api/v1', (req, res, next) => {
//   res.send('Hello');
//   next();
// });

app.listen(`${stage.port}`, () => {
    console.log(`Server now listening at localhost:${stage.port} for Customer-Microservice-ISP-Solutions`);
});

module.exports = app;