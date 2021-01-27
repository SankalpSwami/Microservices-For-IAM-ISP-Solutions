const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const connUri = process.env.MONGO_LOCAL_CONN_URL;
const LCO = require("../models/lco");

module.exports = {
    getAll: (req, res) => {
        mongoose.Promise = global.Promise;
        mongoose.connect(
            connUri,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
            },
            (err) => {
                console.log("DATABASE CONNECTION STATUS : CONNECTED !!!");
                let result = {};
                let status = 200;
                if (!err) {
                    const payload = req.decoded;
                    if (payload && payload.user.useraccesslevel === '1') {
                        LCO.find({}, (err, lco) => {
                            if (!err) {
                                result.status = status;
                                result.error = err;
                                result.result = lco;
                            } else {
                                status = 500;
                                result.status = status;
                                result.error = err;
                            }
                            res.status(status).send(result);
                        }).then(() =>
                            mongoose.connection.close(() => {
                                console.log("DATABASE CONNECTION STATUS : DISCONNECTED !!!");
                            })
                        );
                    } else {
                        status = 401;
                        result.status = status;
                        result.error = `Authentication error`;
                        res.status(status).send(result);

                        mongoose.connection.close(() => {
                            console.log('DATABASE CONNECTION STATUS : DISCONNECTED !!!')
                        });
                    }
                } else {
                    status = 500;
                    result.status = status;
                    result.error = err;
                    res.status(status).send(result);

                    mongoose.connection.close(() => {
                        console.log("DATABASE CONNECTION STATUS : DISCONNECTED !!!");
                    });
                }
            }
        );
    },
};