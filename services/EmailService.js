const { model } = require("mongoose");
const nodemailer = require("nodemailer");
const ActivateCodeModel = require("../models/ActivatationCode");
const {
  generateCode,
  generateAndSaveCode,
} = require("./ActivationCodeService");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "projects.natan@gmail.com",
    pass: "sgblnkvoxyonaqdk",
  },
});



async function sendEmail(emailAddress, name, userId) {
  const generatedCode = await generateAndSaveCode(userId);

  // save activation code into db.

  const mailOptions = {
    from: "projects.natan@gmail.com",
    to: emailAddress,
    // to: "Natanger97@gmail.com",
    subject: "User Activation",
    html: `<h3>Welcome ${name}, </h3><h3>Activation code:</h3><h4>Code:${generatedCode.code}</h4>`,
  };

  // send mail
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

async function resendEmail(emailAddress, name, code) {

  // save activation code into db.

  const mailOptions = {
    from: "projects.natan@gmail.com",
    to: emailAddress,
    // to: "Natanger97@gmail.com",
    subject: "User Activation",
    html: `<h3>Welcome ${name}, </h3><h3>Activation code:</h3><h4>Code:${code}</h4>`,
  };

  // send mail
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = { sendEmail };
