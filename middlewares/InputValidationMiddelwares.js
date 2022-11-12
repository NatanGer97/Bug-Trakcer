const { UserValidationSchema } = require("../ValidationSchemas/UserValidationSchema")
const ServerError = require('../Errors/ServerError');

module.exports.validateUserInput = (req, res, next) => 
{
    const {error} = UserValidationSchema.validate(req.body);

    if (error) {
        const message = error.details.map(err => err.message).join(",");
        
        throw new ServerError(message, 400);
    }
    else {
        next();
    }
};