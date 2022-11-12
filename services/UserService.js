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


