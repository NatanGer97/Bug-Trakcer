const { RolesEnum } = require("../../Enums/RolesEnum");


module.exports.AuthorizationAdminUser = (req,res, next) =>
{
    // test if the current user is admin user;
    if (req.roles.includes(RolesEnum.Admin)) {
        next();
    }
    
}