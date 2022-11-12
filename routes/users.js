var express = require("express");
const UserModel = require("../models/User");
const {
  validateUserInput,
} = require("../middlewares/InputValidationMiddelwares");
var router = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CatchAsync = require("../utils/CatchAsync");

const SECRET_KEY = "KGGK>HKHVHJVKBKJKJBKBKHKBMKHB";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "projects.natan@gmail.com",
    pass: "sgblnkvoxyonaqdk",
  },
});

const mailOptions = {
  from: "projects.natan@gmail.com",
  to: "Natanger97@gmail.com",
  subject: "Sending Email using Node.js",
  text: "That was easy",
};

const UserController = require("../controllers/UserController");
const verifyRoles = require("../middlewares/auth/VerifyRoles");

// router.get('/', verifyRoles("User"), UserController.getUsers);

router.route('/')
  .get(verifyRoles("User"), UserController.getUsers);

module.exports = router;
