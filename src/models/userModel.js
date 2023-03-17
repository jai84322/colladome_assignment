const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    fname :{
        type : String,
        require : true
    },

    lname :{
        type : String,
        require : true
    },

    gender : {
        type : String,
        required: true,
        enum : ["Male", "Female", "Other"]
    },

    email :{
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },

    password : {
        type : String,
        required : true
    }

}, {timestamps : true});

module.exports = mongoose.model("User", userSchema );