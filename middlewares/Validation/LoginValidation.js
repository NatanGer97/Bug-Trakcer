
const {LoginValidationSchema} = require('../../ValidationSchemas/LoginValidationSchema')
module.exports.LoginInputValidation = (req, res, next) => {
    const { error } = LoginValidationSchema.validate(req.body);
  
    if (error) {
      const message = error.details.map((err) => err.message).join(",");
  
      throw new ServerError(message, 400);
    } else {
      next();
    }
  };