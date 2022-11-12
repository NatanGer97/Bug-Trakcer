
const Joi = require('joi');

module.exports.UserValidationSchema = Joi.object({
    name: Joi.string().regex(/^[a-zA-Z+$]/).min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required()
})