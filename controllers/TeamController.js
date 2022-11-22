const TeamModel = require("../models/Team");
const UserModel = require("../models/User");
const ServerError = require("../Errors/ServerError");
const { FindUser, FindUserByIdOrThrow } = require("../services/UserService");
const { TeamDTO } = require("../models/DTO/TeamDTO");
const { FindTeamByIdOrThrow } = require("../services/TeamService");
const { UserDTO } = require("../models/DTO/UserDTO");

const createTeam = async (req, res, next) => {
  const teamLeaderId = req.body.team_leader;
  const teamMembersIds = req.body.team_members;

  let membersOfTeam = [];

  try {
    const teamLeader = await UserModel.findById(teamLeaderId).exec();
    if (!teamLeader) {
      throw new ServerError("team leader not found", 404);
    }

    for (let index = 0; index < teamMembersIds.length; index++) {
      const teamMemberId = teamMembersIds[index];
      const foundUser = await UserModel.findById(teamMemberId).exec();
      if (!foundUser) {
        throw new ServerError("user not found", 404);
      }

      // member exists
      membersOfTeam.push(foundUser);
    }

    // save team to db
    const newTeam = new TeamModel(req.body);

    const savedTeam = await newTeam.save();

    // connect user to each team;
    await UserModel.updateOne(
      { _id: teamLeaderId },
      { $set: { team: savedTeam._id } }
    );
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
          req.body.name,
          savedTeam._id
        )
      );
  } catch (err) {
    next(err);
  }
};

const deleteTeam = async (req, res, next) => {
  const teamIdToDelete = req.params.teamId;

  try {
    const foundTeam = await FindTeamByIdOrThrow(teamIdToDelete);
    const deletedTeam = await TeamModel.findByIdAndDelete(foundTeam._id).exec();

    /* many -> one
    need to remove team from the team leader 
    need to remove the team from each team member */
    foundTeam.team_members.push(foundTeam.team_leader);
    await UserModel.updateMany(
      { _id: { $in: foundTeam.team_members } },
      { $set: { team: null } }
    )
      .exec()
      .then((results) => {
        console.log(results);
        // return res.json({ "deleted-team": deletedTeam });
        return res.json({ message: "team-deleted" });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    return res.json({ error: err });
  }
};

const getTeam = async (req, res, next) => {
  const teamId = req.params.teamId;

  try {
    const foundTeam = await FindTeamByIdOrThrow(teamId);
    res.json(
      new TeamDTO(
        foundTeam.team_leader,
        foundTeam.team_members,
        foundTeam.name,
        foundTeam._id
      )
    );
  } catch (err) {
    next(err);
  }
};

const updateTeam = async (req, res, next) => {
  const teamId = req.params.teamId;
  const teamInReq = req.body;

  const teamFromDb = await FindTeamByIdOrThrow(teamId);

  // setting newer values
  teamFromDb.name = teamInReq.name;
  teamFromDb.team_members = teamInReq.team_members;
  teamFromDb.team_leader = teamInReq.team_leader;

  // updating team in db
  try {
    const updatedTeam = await teamFromDb.save();
    res.json(
      new TeamDTO(
        updatedTeam.team_leader,
        updatedTeam.team_members,
        updatedTeam.name,
        updatedTeam._id
      )
    );
  } catch (err) {
    next(err);
  }
};

const addOrRemoveTeamMember = async (req, res, next) => {
  // {action: "add" || "remove"}
  const action = req.query.action;
  // if the action is not valid - throw error
  if (!action || (action !== "add" && action !== "remove")) {
    next(new ServerError("invalid action", 400));
  }

  const teamId = req.params.teamId;
  const userId = req.params.userId;
  try {
    const foundTeam = await FindTeamByIdOrThrow(teamId);
    const foundUser = await FindUserByIdOrThrow(userId);

    if (action === "add") {

      foundTeam.team_members.push(foundUser._id);
      foundUser.team = foundTeam._id;

    } else if (action === "remove") {

      foundTeam.team_members = foundTeam.team_members.filter((memberId) => {
        return memberId.toString() !== foundUser._id.toString();
      });
      foundUser.team = null;
    }

    const updatedTeam = await foundTeam.save();
    const updatedUser = await foundUser.save();

    res.json({
      updatedTeam: new TeamDTO(
        updatedTeam.team_leader,
        updatedTeam.team_members,
        updatedTeam.name,
        updatedTeam._id
      ),
      updatedUser: new UserDTO(
        updatedUser._id,
        updatedUser.name,
        updatedUser.email,
        updatedUser.team,
        updatedUser.role
      ),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTeam, deleteTeam, getTeam, updateTeam, addOrRemoveTeamMember};
