const express = require("express");
const router = express.Router();
const RoleModel = require("../models/Roles");
const RoleController = require("../controllers/RoleController");
const {
  RoleInputValidation,
  AddRoleToUserValidation,
} = require("../middlewares/Validation/RoleValidation");


router.post("/", RoleInputValidation, RoleController.createNewRoleHandler);
router.post("/addRole", AddRoleToUserValidation, RoleController.addRoleToUser);
module.exports = router;
