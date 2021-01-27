require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();
const cors = require('cors');

const environment = process.env.NODE_ENV;
const stage = require('./config')[environment];

const routes = require('./src/routes/index');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cors()) // cool now everything is handled!

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});



if (environment !== 'production') {
    app.use(logger('dev'));
}

app.use('/api/v1', routes(router));

app.listen(`${stage.port}`, () => {
    console.log(`Server now listening at localhost:${stage.port} for ISP-Microservice-ISP-Solutions`);
});

module.exports = app;