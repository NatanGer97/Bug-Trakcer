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
router.use(AuthorizationAdminUser)

router.get("/:teamId", teamController.getTeam);
router.post("/", NewTeamValidation, teamController.createTeam);
router.delete("/:teamId", teamController.deleteTeam);

module.exports = router;
