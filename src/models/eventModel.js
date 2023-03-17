const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const eventSchema = new mongoose.Schema({

    title : {
        type : String, 
        required: true
    },
    description : {
        type : String,
        required : true
    },
    createdBy : {
        type : String,
        required: true
    },
    userId : { 
        type: ObjectId, 
        ref: "User", 
        required: true 
    },
    invitee: {
        type : [ObjectId],
        ref : "User",
        required: true
    },
    date : {
        type : Date
    },


}, {timestamps:true});

module.exports = mongoose.model("Event", eventSchema );