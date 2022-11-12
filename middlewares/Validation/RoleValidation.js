const {
  RoleValidationSchema, RoleToUserSchema,
} = require("../../ValidationSchemas/RoleValidationSchema");
const ServerError = require("../../Errors/ServerError");

module.exports.RoleInputValidation = (req, res, next) => {
  const { error } = RoleValidationSchema.validate(req.body);

  if (error) {
    const message = error.details.map((err) => err.message).join(",");

    throw new ServerError(message, 400);
  } else {
    next();
  }
};

module.exports.AddRoleToUserValidation = (req, res, next) => {
  const { error } = RoleToUserSchema.validate(req.body);

  if (error) {
    const message = error.details.map((err) => err.message).join(",");

    throw new ServerError(message, 400);
  } else {
    next();
  }
};
