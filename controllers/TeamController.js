const TeamModel = require("../models/Team");
const UserModel = require("../models/User");
const ServerError = require("../Errors/ServerError");
const { FindUser } = require("../services/UserService");
const { TeamDTO } = require("../models/DTO/TeamDTO");

const createTeam = async (req, res, next) => {
  const teamLeaderId = req.body.team_leader;
  const teamMembersIds = req.body.team_members;

  let membersOfTeam = [];

  try {
    const teamLeader = await UserModel.findById(teamLeaderId).exec();

    if (!teamLeader) {
      throw new ServerError("team leader not found", 404);
    }

    // const results = await UserModel.find({_id: {$in: teamMember}}).exec();
    for (let index = 0; index < teamMembersIds.length; index++) {
      const teamMemberId = teamMembersIds[index];
      const foundUser = await UserModel.findById(teamMemberId).exec();
      if (!foundUser) {
        throw new ServerError("user not found", 404);
      }

      // user exists
      membersOfTeam.push(foundUser);
    }

    // save team to db
    const newTeam = new TeamModel(req.body);

    const savedTeam = await newTeam.save();

    // connect user to each team;
    await UserModel.updateOne({_id: teamLeaderId}, {$set: {team: savedTeam._id}});
    const updatedTeamMembers = await UserModel.updateMany(
      { _id: { $in: teamMembersIds } },
      { $set: { team: savedTeam._id } }
    ).exec();

    return res
      .status(201)
      .json(
        new TeamDTO(
          savedTeam.team_leader,
          membersOfTeam,
          req.body.name
        )
      );
    //   .json(new TeamDTO(teamLeader, membersOfTeam, req.body.name));
  } catch (err) {
    next(err);
  }
};

module.exports = { createTeam };
