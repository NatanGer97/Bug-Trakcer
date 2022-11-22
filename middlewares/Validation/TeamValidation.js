
const ServerError = require("../../Errors/ServerError");
const {
  NewTeamSchema,
} = require("../../ValidationSchemas/TeamValidationSchemas");

module.exports.NewTeamValidation = (req, res, next) => {
  const { error } = NewTeamSchema.validate(req.body);

  if (error) {
    
    const message = error.details.map((err) => err.message).join(",");
    console.log(message);
    throw new ServerError(message, 400);
  } else {
    next();
  }
};
