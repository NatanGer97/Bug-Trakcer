const ServerError = require("../../Errors/ServerError");
const {
  ActivationCodeSchema,
} = require("../../ValidationSchemas/ActivationCodeSchema");

module.exports.ActivationCodeValidation = (req, res, next) => {
  const { error } = ActivationCodeSchema.validate(req.body);

  if (error) {
    console.log("error -> activation code validation");
    const message = error.details.map((err) => err.message).join(",");
    console.log(message);
    throw new ServerError(message, 400);
  } else {
    next();
  }
};
