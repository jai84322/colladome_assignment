
const express = require('express')
const router = express.Router()
const {createUser, login, changePassword, logout, updatePassword, resetPassword} = require("../controllers/userController");
const { createEvent, invite, list, getEvent, updateEvent } = require("../controllers/eventController");
const { authentication } = require("../middlewares/auth");

// ----------------------------- user Api's ------------------------------------------------------------------- //

router.post("/users", createUser );

router.post("/login", login );

router.put("/users/:id", authentication, changePassword );

router.post("/logout", authentication, logout);

router.put("/updatePassword", updatePassword );

router.post("/resetPassword", resetPassword );

// ---------------------------- event Api's -------------------------------------------------------------------- // 

router.post("/events", authentication, createEvent);

router.get("/checkEvents/:userId", authentication, invite );

router.get("/events", authentication, list);

router.get("/events/:eventId", authentication, getEvent)

router.put("/events/:eventId", authentication, updateEvent);


module.exports=router;