const Joi = require("joi");

module.exports.NewTeamSchema = Joi.object({
  name: Joi.string().min(2).required(),
  team_leader: Joi.string().required(),
  team_members: Joi.array().min(1).required(),

});
