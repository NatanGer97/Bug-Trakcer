const UserModel = require("../models/User");

exports.FindUser = (userId) => {
  UserModel.findOne({_id: userId})
    .exec()
    .then((user) => {
        return user;
         
    })
    .catch((err) => {
      throw err;
    });
};


exports.FindUserByIdOrThrow = async (userId) =>
{
   try {
    const user = await UserModel.findById(userId).exec()
    if (user !== null) {
        return user;
    }
    throw new ServerError(`user with given id: ${userId} not found`, 404);
   } catch (err)
   {
    throw err;
   }

}