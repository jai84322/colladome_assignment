const mongoose = require("mongoose");


const isValidRequest = function (value) {
    if (Object.keys(value).length == 0 ) return false
    return true
};

const isValidObjectId = function (value) {
    let ObjectId = mongoose.Types.ObjectId
    return ObjectId.isValid(value)
};

function isValidString(x){
    if(typeof x != "string") return false;
    const regEx = /^\s*[a-zA-Z]+(\.[a-zA-Z\s]+)*[a-zA-Z\s]\s*$/;
    console.log(regEx.test(x)) 
    return regEx.test(x)
};

const isValid = function (value) {
    if (typeof value == "number" || typeof value == "boolean" || value == null ) return false
    if (typeof value === "string" && value.trim().length == 0) return false
    return true 
};

function removeSpaces(x){
    return x.split(" ").filter((y)=> y ).join(" ")
};

function isValidEmail(x){
    const regEx = /^\s*[a-zA-Z][a-zA-Z0-9]*([-\.\_\+][a-zA-Z0-9]+)*\@[a-zA-Z]+(\.[a-zA-Z]{2,5})+\s*$/;
    return regEx.test(x)
};

//subCategory
function isValidInvitee(x){ 
    if(!Array.isArray(x)) return false;
    if(x.length === 0) return false;
    for(let i=0; i<x.length; i++){
        if(!x[i]) return false;
        if(typeof x[i] !== "string") return false;
        if(x[i].trim().length === 0) return false;
        if (!isValidObjectId(x[i])) return false;
    }
    return true
}

function isValidPassword(x){
    const regEx = /^\s*(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,25}\s*$/    ;
    return regEx.test(x);
};

module.exports = {isValidRequest,isValid, isValidInvitee, isValidObjectId, isValidPassword, isValidString, isValidEmail, removeSpaces};