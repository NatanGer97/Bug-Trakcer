const express = require("express");

const router = express.Router();

const teamController = require("../controllers/TeamController");
const {
  AuthorizationAdminUser,
} = require("../middlewares/auth/AdminAuthorization");
const {
  NewTeamValidation,
} = require("../middlewares/Validation/TeamValidation");


// TODO: add validation middleware
router.use(AuthorizationAdminUser);



router.post("/", NewTeamValidation, teamController.createTeam);
router.get("/:teamId", teamController.getTeam);
router.put("/:teamId", NewTeamValidation,teamController.updateTeam);
router.put("/:teamId/:userId", teamController.addOrRemoveTeamMember);
router.delete("/:teamId", teamController.deleteTeam);

module.exports = router;
