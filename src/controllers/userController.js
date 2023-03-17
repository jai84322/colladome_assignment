const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const {isValidRequest, isValid, isValidObjectId, isValidInvitee, isValidPassword, isValidString, isValidEmail, removeSpaces} = require("../validations/validator");

const createUser = async function (req, res) {
    try {
        let { fname, lname, gender, email, password } = req.body
        let obj = {}
        
        if (!isValidRequest(req.body)) {
            return res.status(400).send({ status: false, msg: "Please enter data in the request body" })
        }
        
        if (!fname) {
            return res.status(400).send({ status: false, msg: "fname is missing" })
        } else  if (!isValidString(fname)) {
            return res.status(400).send({ status: false, message: "please enter valid fname string input" })
        } else {
            obj.fname = removeSpaces(fname)
        }

        if (!lname) {
            return res.status(400).send({ status: false, msg: "lname is missing" })
        } else  if (!isValidString(lname)) {
            return res.status(400).send({ status: false, message: "please enter valid lname string input" })
        } else {
            obj.lname = removeSpaces(lname)
        }

        if (!gender) {
            return res.status(400).send({ status: false, msg: "title is missing" })
        } else if(!(gender == "Male" || title == "Female" || title == "Other")) {
            return res.status(401).send({error : "gender has to be Male or Female or Other "})
        } else {
            obj.gender = gender;
        }

        if (!email) {
            return res.status(400).send({ status: false, msg: "email is missing" })
        } else if (!isValidEmail(email)) { 
            return res.status(400).send({ status: false, message: "Please provide valid email" })
        }

        let uniqueEmail = await userModel.findOne({ email: email })
        if (uniqueEmail) {
            return res.status(400).send({ status: false, msg: "This email already exists" })
        } else {
            obj.email = email;
        }

        if (!password) {
            return res.status(400).send({ status: false, msg: "password is missing" })
        } else if (!isValidPassword(password)) { 
            return res.status(400).send({status:false, message: "please enter valid password length should be between 8-25, one uppercase, one lowercase, one digit, one special character"})
        } else {
            let encryptedPassword = await bcrypt.hash(password, saltRounds);
            obj.password = encryptedPassword;
        }

        let savedData = await userModel.create(obj);
        return res.status(201).send({status: true, msg : "user created successfully", data: savedData });
} catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
}
}

const login = async function (req, res) {

    try {

    let {email, password} = req.body;
    if (!email) {
        return res.status(400).send({ status: false, msg: "please enter email" })
    }

    if (!password) {
        return res.status(400).send({ status: false, msg: "please enter password " })
    }

    let user = await userModel.findOne({ email: email });
    if (!user) {
        return res.status(400).send({ status: false, msg: "Invalid email" })
    }

    let decrypt = await bcrypt.compare(password, user.password) 
       
    if (!decrypt) {
        return res.status(400).send({ status: false, msg: "Invalid password" })
    }


    let token = jwt.sign(
        {
            id: user._id.toString(),
        },
        "colladome_assignment", { expiresIn: "1d" })

    res.setHeader("x-api-key", token)

    return res.status(200).send({ status: true,  msg: "you are successfully loggedin", data: token })
} catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
}

}



const changePassword = async function(req, res) {

    try {

    let { oldPassword, newPassword } = req.body;
    let userId = req.params.id
    if (!isValidObjectId(userId)) {
        return res.status(400).send({ status: false, message: "please enter valid user Id" })
    }
    let user = await userModel.findOne({ _id : userId });

    let decrypt = await bcrypt.compare(oldPassword, user.password) 
    if (!decrypt) {
        return res.status(400).send({ status: false, msg: "Invalid password" })
    }

    newPassword = await bcrypt.hash(newPassword, saltRounds);

    let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, {password: newPassword}, { new: true })
    return res.status(200).send({ status: true, msg : "password updated successfully", data: updatedUser })

} catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
}

}

let logout = async function (req,res) {
    
    let user = req.decodedToken.id
    let token = jwt.sign(
        {
            id: user,
        },
        "colladome_assignment", { expiresIn: "0.1s" }
    )

    return res.status(200).send({ status: true, msg: "user logged out successfully" })
}

let updatePassword = async function (req,res) {
    
    let token = req.headers["x-api-key" || "X-Api-Key"]
    let newPassword = req.body.newPassword;
        if (!token) {
            return res.status(400).send({ status: false, msg: "please send the token" })
        }

        let decodedToken = jwt.verify(token, "colladome_assignment_password_reset", {ignoreExpiration:true}, function (error, token) {
            if (error) {
                return undefined
            } else {
                return token
            }
        })

        if (decodedToken == undefined) {
            return res.status(401).send({ status: false, msg: "invalid token" })
        }
        if(Date.now() > decodedToken.exp*1000) return res.status(401).send({status:false, message: "Token session expired"}); 

        if (!newPassword) {
            return res.status(400).send({ status: false, msg: "password is missing" })
        } else if (!isValidPassword(password)) { 
            return res.status(400).send({status:false, message: "please enter valid password length should be between 8-25, one uppercase, one lowercase, one digit, one special character"})
        } else {
            newPassword = await bcrypt.hash(newPassword, saltRounds);
        }

        let userId = decodedToken.id 
        let user = await userModel.findOneAndUpdate({ _id : userId }, {password : newPassword}, {new : true});
        
        return res.status(200).send({ status: true, msg: "password updated successfully", data: user  })

}

let resetPassword = async function (req,res) {

    let email = req.body.email;
    if (!email) {
        return res.status(400).send({ status: false, msg: "email is missing" })
    }

    let user = await userModel.findOne({ email : email });
    if (!user) {
        return res.status(400).send({ status: false, msg: "please enter valid email" })
    }

    let token = jwt.sign(
        {
            id: user._id.toString(),
        },
        "colladome_assignment_password_reset", { expiresIn: "15m" }
        )


    return res.status(200).send({ status: true, data: token, msg: "token valid for next 15mins only" })

}

module.exports = { createUser, login, changePassword, logout, updatePassword, resetPassword }