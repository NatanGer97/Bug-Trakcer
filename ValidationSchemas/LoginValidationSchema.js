
const Joi = require('joi');

module.exports.UserValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required()
});