const { UserDTO } = require("../models/DTO/UserDTO");
const UserModel = require("../models/User");

exports.getUsers = async(req, res) =>
{
    const users = await UserModel.find({});
    // const users = await UserModel.find({}).populate('roles', 'role_name')
    if (users.length > 0)
    {
        const usersDto = users.map((user) => new UserDTO(user))
        return res.json({'users': usersDto});
    }

    return res.json("no users was found");
    
}

