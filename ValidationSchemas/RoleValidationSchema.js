
const Joi = require('joi');

module.exports.RoleValidationSchema = Joi.object({
    role_name: Joi.string().regex(/^[a-zA-Z+$]/).min(1).required(),
    role_code: Joi.number().min(3).required(),
});


module.exports.RoleToUserSchema = Joi.object({
    userId: Joi.string().required(),
    roleName: Joi.string().required(),
});
