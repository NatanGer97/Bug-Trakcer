
const Joi = require('joi');

module.exports.ActivationCodeSchema = Joi.object({
    userId: Joi.string().required(),
    code: Joi.string().min(4).max(4).required()
});