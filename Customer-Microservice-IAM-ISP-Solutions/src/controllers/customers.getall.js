const mongoose = require('mongoose');
const connUri = process.env.MONGO_LOCAL_CONN_URL;
const Customer = require("../models/customers");


module.exports = {
    getAll: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
            let result = {};
            let status = 200;
            if (!err) {
                const payload = req.decoded;
                console.log('PAYLOAD', payload);
                if (payload && payload.user.useraccesslevel === '1') {
                    Customer.find({}, (err, users) => {
                        if (!err) {
                            result.status = status;
                            result.error = err;
                            result.result = users;
                        } else {
                            status = 500;
                            result.status = status;
                            result.error = err;
                        }
                        res.status(status).send(result);
                    }).then(() => mongoose.connection.close());
                } else {
                    status = 401;
                    result.status = status;
                    result.error = `Authentication error`;
                    res.status(status).send(result);

                    mongoose.connection.close();
                }
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);

                mongoose.connection.close();
            }
        });
    }
};
