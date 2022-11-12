const RoleModel = require("../models/Roles");
const UserModel = require("../models/User");

module.exports.createNewRoleHandler = (req, res) => {
  const role = req.body;
  if (!role) return res.sendStatus(400);

  const savedRole = new RoleModel(role);
  savedRole
    .save()
    .then((data) => {
      return res.status(201).json({ role: data });
    })
    .catch((err) => {
      console.log("err" + err);
      res.status(400).send(err);
    });
};

module.exports.addRoleToUser = async (req, res) => 
{
    const userId = req.body.userId;
    const roleNameToAdd = req.body.roleName;

    const user = await UserModel.findById(userId).exec();
    // return res.send(user);
    if (!user) return res.status(404).json({'message': 'user not found'});

    const role = await RoleModel.findOne({role_name: roleNameToAdd}).exec();
    // return res.send(role)
    if (!role) return res.status(404).json({'message': 'role not found'});
    
    const results = await UserModel
    .updateOne({_id: user._id}, {$push: {roles: role}}).exec();

    return res.send(results);

    

    
}


// module.exports = createNewRoleHandler;