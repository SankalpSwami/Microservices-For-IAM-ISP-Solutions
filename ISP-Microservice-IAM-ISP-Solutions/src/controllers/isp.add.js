const mongoose = require("mongoose");
const axios = require('axios');
const qs = require('querystring');
const crypto = require('crypto');

const connUri = process.env.MONGO_LOCAL_CONN_URL;
const ISP = require("../models/isp");


module.exports = {
    add: (req, res) => {
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
                        const token = req.headers.authorization.split(' ')[1];
                        const config = {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                Authorization: 'Bearer ' + token
                            }
                        }
                        const businessname = req.body.businessname;
                        const email = req.body.email;
                        const mobilenumber = req.body.mobilenumber;
                        const adhaarnumber = req.body.adhaarnumber;
                        const city = req.body.city;
                        const pincode = req.body.pincode;
                        const state = req.body.state;
                        const address = req.body.address;
                        const contactperson = req.body.contactperson;
                        const password = crypto.randomBytes(8).toString('hex');
                        const registeredby = payload.user.username;
                        const unique = crypto.randomBytes(8).toString('hex');
                        const access = 1;
                        const isp = new ISP({
                            businessname,
                            email,
                            mobilenumber,
                            adhaarnumber,
                            city,
                            pincode,
                            state,
                            address,
                            contactperson,
                            useraccesslevel,
                        });
                        const data = {
                            username: email,
                            password: password,
                            registeredby: registeredby,
                            uniqueid: unique,
                            useraccesslevel: access,
                        }
                        // document = instance of a model
                        // TODO: We can hash the password here as well before we insert
                        isp.save((err, isp) => {
                            if (!err) {
                                result.status = status;
                                result.result = isp;
                                axios.post('http://103.141.78.11/crm/api/v1/users', qs.stringify(data), config)
                                    .then((result) => {
                                        console.log(result);
                                    }).catch((err) => {
                                        console.log(err);
                                    });
                            } else {
                                status = 500;
                                result.status = status;
                                result.error = err;
                            }
                            res.status(status).send(result);
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