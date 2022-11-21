const Joi = require("joi");

module.exports.NewTeamSchema = Joi.object({
  name: Joi.string().required(),
  team_leader: Joi.object().required(),
  team_members: Joi.array().min(1).required(),

});
