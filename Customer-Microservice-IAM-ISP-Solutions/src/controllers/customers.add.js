const mongoose = require("mongoose");
const connUri = process.env.MONGO_LOCAL_CONN_URL;
const Customer = require("../models/customers");


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
                    console.log(payload);
                    if (payload && payload.user.useraccesslevel === '1') {
                        const firstname = req.body.firstname;
                        const lastname = req.body.lastname;
                        const email = req.body.email;
                        const mobilenumber = req.body.mobilenumber;
                        const adhaarnumber = req.body.adhaarnumber;
                        const city = req.body.city;
                        const pincode = req.body.pincode;
                        const state = req.body.state;
                        const address = req.body.address;
                        const registeredby = payload.user.username;
                        const customer = new Customer({
                            firstname,
                            lastname,
                            email,
                            mobilenumber,
                            adhaarnumber,
                            city,
                            pincode,
                            state,
                            address,
                            registeredby
                        });
                        // document = instance of a model
                        // TODO: We can hash the password here as well before we insert
                        customer.save((err, customer) => {
                            if (!err) {
                                result.status = status;
                                result.result = customer;
                            } else {
                                status = 500;
                                result.status = status;
                                result.error = err;
                                console.log(err);
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