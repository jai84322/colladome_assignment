const eventModel = require("../models/eventModel");
const {isValidRequest, isValidObjectId, isValid, isValidInvitee, isValidPassword, isValidString, isValidEmail, removeSpaces} = require("../validations/validator");

const createEvent = async function (req, res) {
    try {
        let { title, description, createdBy, userId, invitee, date } = req.body
        let obj = {}
        
        if (!isValidRequest(req.body)) {
            return res.status(400).send({ status: false, msg: "Please enter data in the request body" })
        }

        if (!title) {
            return res.status(400).send({ status: false, msg: "title is missing" })
        } else  if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "please enter valid title string input" })
        } else {
            obj.title = removeSpaces(title)
        }

        if (!description) {
            return res.status(400).send({ status: false, msg: "description is missing" })
        } else  if (!isValid(description)) {
            return res.status(400).send({ status: false, message: "please enter valid description input" })
        } else {
            obj.description = removeSpaces(description)
        }

        if (!createdBy) {
            return res.status(400).send({ status: false, msg: "creator name is missing" })
        } else  if (!isValid(createdBy)) {
            return res.status(400).send({ status: false, message: "please enter valid creator name string input" })
        } else {
            obj.createdBy = removeSpaces(createdBy)
        };

        if (!userId) {
            return res.status(400).send({ status: false, msg: "userId is missing" })
        } else if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "please enter valid user Id" })
        } else {
            obj.userId = userId
        };

        if (!invitee) {
            return res.status(400).send({ status: false, msg: "invitee array is missing" })
        } else  if (!isValidInvitee(invitee)) {
            return res.status(400).send({ status: false, message: "please enter valid invitee ObjectId string input inside array" })
        } else {
            obj.invitee = invitee
        };

        if (!date) {
            return res.status(400).send({ status: false, msg: "date is missing" })
        } else {
            obj.date = date
        };

    let savedData = await eventModel.create(obj);
    return res.status(201).send({status: true, msg : "event created successfully", data: savedData });
} catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
}
};


const invite = async function (req,res) {

    let obj = {}
    let userId = req.params.userId;
    if (!userId) {
        return res.status(400).send({ status: false, msg: "userId is missing" })
    } else if (!isValidObjectId(userId)) {
        return res.status(400).send({ status: false, message: "please enter valid user Id" })
    }

    let myCreatedEvents = await eventModel.find({ userId: userId }).select({title:1, createdBy:1, _id:0});
    obj.eventsCreated = myCreatedEvents;
    let arr = []
    
    let invitedEvents = await eventModel.find({}).select({title:1,invitee:1,createdBy:1});
    for (let i=0; i<invitedEvents.length;i++) {
        for(let j=0; j<invitedEvents[i].invitee.length; j++) {
            let checkId = invitedEvents[i].invitee[j].toString();
            if (userId == checkId) {
                arr.push(invitedEvents[i]);
            }
        }
    } 
    
    obj.eventsInvited = arr;

    return res.status(200).send({status: true, msg : "events fetched successfully", data: obj });
};

const list = async function (req,res) {

    let { page, title, createdBy, userId, titleSort, dateStarts, dateEnds } = req.query
    let filters = {}

    if (page) {
        if (page<1) {
            return res.status(400).send({status: false, message : "page value less than 1 is not allowed"})
        }
    }

    if (titleSort) {
        let arr = ["1","-1"]
        if (!arr.includes(titleSort)) {return res.status(400).send({status: false, message : "titleSort value can only be 1 or -1"})}
    }

    if (title) {
        let findTitle = await eventModel.find()
        let fTitle = findTitle.map(x => x.title).filter(x => x.includes(title))
        filters.title = {$in : fTitle} 
    }

    if (createdBy) {
        filters.createdBy = createdBy;
    }

    if (userId) {
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "please enter valid user Id" })
        } else {
        filters.userId = userId;
        }
    }

    let getData = await eventModel.find(filters).sort({title: titleSort }).skip((page-1)*3).limit(5);
    if (getData.length == 0) return res.status(200).send({status:false, message:"no documents found / no more documents"})
    return res.status(200).send({ status: true, count:getData.length, message: "event details", data: getData })

};

const getEvent = async function (req,res) {

    let eventId = req.params.eventId
    if (!eventId) {
        return res.status(400).send({ status: false, msg: "eventId is missing" })
    } else if (!isValidObjectId(eventId)) {
        return res.status(400).send({ status: false, message: "please enter valid eventId" })
    }

    let eventDetails = await eventModel.findById({_id:eventId});
    return res.status(200).send({status: true, msg : "event fetched successfully", data: eventDetails});

};


const updateEvent = async function (req,res) {

    let eventId = req.params.eventId
    if (!eventId) {
        return res.status(400).send({ status: false, msg: "eventId is missing" })
    } else if (!isValidObjectId(eventId)) {
        return res.status(400).send({ status: false, message: "please enter valid eventId" })
    }

    let {title, description, createdBy, invitee, date} = req.body

    if (!isValidRequest(req.body)) {
        return res.status(400).send({ status: false, msg: "Please enter data in the request body" })
    }

    if (title) {
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "please enter valid title input" })
        } else {
            title = removeSpaces(title)
        }
    }

    if (description) {
        if (!isValid(description)) {
            return res.status(400).send({ status: false, message: "please enter valid description input" })
        } else {
            description = removeSpaces(description)
        }
    }

    if (createdBy) {
        if (!isValid(createdBy)) {
            return res.status(400).send({ status: false, message: "please enter valid creator name input" })
        } else {
            createdBy = removeSpaces(createdBy)
        }
    }

    if (invitee) {
        if (!isValidInvitee(invitee)) {
            return res.status(400).send({ status: false, message: "please enter valid invitee ObjectId string input inside array" })
        }
    }


    let updatedEvent = await eventModel.findOneAndUpdate({ _id: eventId },
    {
        title: title,
        description: description,
        createdBy: createdBy,
        $push: { invitee: invitee},
        date : date
    },
    { new: true }) 

    return res.status(200).send({status: true, msg : "event updated successfully", data: updatedEvent});    

};

module.exports = { createEvent, invite, list, getEvent, updateEvent };