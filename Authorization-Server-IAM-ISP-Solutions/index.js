require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const router = express.Router();
const cors = require('cors');
const helmet = require('helmet');

const environment = process.env.NODE_ENV;
const stage = require('./config')[environment];

const routes = require('./src/routes/index.js');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cors()) // cool now everything is handled!
app.use(helmet());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

if (environment !== 'production') {
    app.use(logger('dev'));
}

app.use('/api/v1', routes(router));
//app.use('/api/v1', (req, res, next) => {
//    res.send('Hello');
//    next();
//});


function test() {

    axios.get("http://172.105.62.12:8001/api/v1/users").then((result) => {
        const ab = result.data.result;
        const ba = ab.length;
        for (var i = 0; i < ba; i++) {
            console.log(ab[i]['username']);

            //console.log(ab);
            //console.log(ba);
            var d = new Date;
        }

        if (d.getDate() == 26 && d.getMonth() == 1) {//15th Aug

            // special script

            console.log('noice')

        } else {

            //rest of the script
            console.log('not noice')
        }
    })
}

test();

setInterval(test, 5000);



app.listen(`${stage.port}`, () => {
    console.log(`Server now listening at localhost:${stage.port}`);
});

module.exports = app;