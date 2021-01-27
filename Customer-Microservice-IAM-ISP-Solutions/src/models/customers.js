const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("mongoose-type-email");


// schema maps to a collection
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true,
        trim: true,
        //unique: true,
    },
    mobilenumber: {
        type: Number,
        required: true,
        trim: true,
        //unique: true,
    },
    adhaarnumber: {
        type: Number,
        required: true,
        trim: true,
        //unique: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    pincode: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    createdat: {
        type: Date,
        required: true,
        trim: true,
        default: Date.now,
    },
    updatedat: {
        type: Date,
        required: true,
        trim: true,
        default: Date.now,
    },
    registeredby: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model("Customer", customerSchema); // instance of schema