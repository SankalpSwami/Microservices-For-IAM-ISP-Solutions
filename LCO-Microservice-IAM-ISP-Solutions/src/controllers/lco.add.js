const mongoose = require("mongoose");
const crypto = require('crypto');

const connUri = process.env.MONGO_LOCAL_CONN_URL;
const LCO = require("../models/lco");

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
                        const registeredby = payload.user.username;
                        const unique = crypto.randomBytes(8).toString('hex');
                        const lco = new LCO({
                            businessname,
                            email,
                            mobilenumber,
                            adhaarnumber,
                            city,
                            pincode,
                            state,
                            address,
                            contactperson,
                            registeredby
                        }); // document = instance of a model
                        // TODO: We can hash the password here as well before we insert
                        const password = crypto.randomBytes(8).toString('hex');
                        const access = 2;
                        const data = {
                            username: email,
                            password: password,
                            email: email,
                            registeredby: registeredby,
                            uniqueid: unique,
                            useraccesslevel: access,
                        }
                        lco.save((err, lco) => {
                            if (!err) {
                                result.status = status;
                                result.result = lco;
                                axios.post('/http://172.105.62.12:8000/api/v1/users', qs.stringify(data), config)
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