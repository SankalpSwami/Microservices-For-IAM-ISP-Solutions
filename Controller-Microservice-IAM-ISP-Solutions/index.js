require('dotenv').config();

const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const mysql = require('mysql');

const environment = process.env.NODE_ENV;
const stage = require('./config')[environment];


//MYSQL DETAILS
var mysqlConnection = mysql.createConnection({
    host: '45.79.126.34',
    user: 'root',
    password: 'p@ssw0rd',
    database: 'radiusdb',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('MariaDB Database Connection Established Successfully');
    else
        console.log('Database Connection Failed!' + JSON.stringify(err, undefined, 2));
});


app.use(bodyparser.json());
if (environment !== 'production') {
    app.use(logger('dev'));
}


app.use(cors()) // cool now everything is handled!
app.use(helmet());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});


app.listen(`${stage.port}`, () => {
    console.log(`Server now listening at localhost:${stage.port} for Radius-Controller-Microservice-ISP-Solutions`);
});
