const RoleModel = require("../models/Roles");

// module.exports.MapIdToRoleName = (...idsOfRoles) => {}
async function MapIdsToRoleName(idsOfRoles) {
  let rolesName = [];
  try {
    const roles = await RoleModel.find({ _id: { $in: idsOfRoles } }).exec();
    console.log(roles);
    rolesName = roles.map((role) => role.role_name);
    return rolesName;
  } catch (err) {
    throw err;
  }
}

module.exports = { MapIdsToRoleName };
