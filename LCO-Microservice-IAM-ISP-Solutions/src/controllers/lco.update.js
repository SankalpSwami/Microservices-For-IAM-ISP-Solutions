const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const connUri = process.env.MONGO_LOCAL_CONN_URL;
const LCO = require("../models/lco");

module.exports = {
    update: (req, res) => {
        mongoose.connect(
            connUri,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
            },
            (err) => {
                let result = {};
                let status = 201;
                if (!err) {
                    const payload = req.decoded;
                    if (payload && payload.user.useraccesslevel === '1') {
                        LCO.findByIdAndUpdate(req.params.lcoId, {
                            businessname: req.body.businessname, mobilenumber: req.body.mobilenumber,
                            adhaarnumber: req.body.adhaarnumber, email: req.body.email, city: req.body.city, pincode: req.body.pincode,
                            state: req.body.state, address: req.body.address, contactperson: req.body.contactperson,
                            useraccesslevel: req.body.useraccesslevel
                        }, (err, next) => {
                            if (!err) {
                                result.status = status;
                                result.result = next;
                            } else {
                                status = 500;
                                result.status = status;
                                result.error = err;
                            }
                            res.status(status).send(result + "Updated Successfully");
                            // Close the connection after saving
                            mongoose.connection.close();
                        });
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

                    mongoose.connection.close();
                }
            }
        );
    },
};