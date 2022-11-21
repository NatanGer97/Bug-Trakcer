const ServerError = require("../Errors/ServerError");
const TeamModel = require("../models/Team")

exports.FindTeamByIdOrThrow = async (teamId) =>
{
   try {
    const team = await TeamModel.findById(teamId).exec()
    if (team !== null) {
        return team;
    }
    throw new ServerError(`team with given id: ${teamId} not found`);
   } catch (err)
   {
    throw err;
   }

}