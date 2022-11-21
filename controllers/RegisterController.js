const UserModel = require("../models/User");
const RoleModel = require("../models/Roles");

const bcrypt = require("bcryptjs");
const { sendEmail } = require("../services/EmailService");
const ActivateCodeModel = require("../models/ActivatationCode");
const ServerError = require("../Errors/ServerError");

exports.handleNewUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required!" });
  }

  const defaultUserRole = await RoleModel.findOne({ role_name: "User" }).exec();
  if (!defaultUserRole)
    return res.status(404).json({ message: "role not found" });

  // check for duplicated username in db
  const userExists = await UserModel.find({ email: email }).count();
  if (userExists) {
    return res.sendStatus(409); // conflict
  }

  try {
    // encrypt password
    // 10 -> salt
    const hashedPassword = await bcrypt.hash(password, 10);

    // store the new user
    const user = new UserModel({
      name: req.body.name,
      email: email,
      password: hashedPassword,
      roles: defaultUserRole,
      is_active: false,
    });

    const savedUser = await user.save();

    //TODO:: send verification code via email
    await sendEmail(savedUser.email, savedUser.name, savedUser);
    const userId = await UserModel.findById(savedUser._id).exec();
    
    res.status(201).json({ success: `New created`, userId: userId.id});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/*
 -- security issues:
  TODO: 1. activation code must be encoded
  
*/
exports.activateUser = async (req, res, next) => {
  const { code, userId } = req.body;

  // check if user with given userId exist
  try {
    const activationCode = await ActivateCodeModel.findOne({
      user_id: userId,
      code: code,
    }).exec();

    if (activationCode !== null) {
      // code is in db - found
      console.log("found code");
      // activation query -> set is_active = true
      const user = await UserModel.findById(userId).exec();
      user
        .updateOne({ $set: { is_active: true } })
        .exec()
        .then((results) => {
          return res.send("user activated");
        })
        .catch((err) => res.send(err));
    } else {
      throw new ServerError("code not found", 404);
    }
  } catch (error) {
    next(error);
  }
};

/*
resend code
TODO:: create new code and update the current activation code

*/
exports.resendActivationCode = async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: "user id empty" });
  ActivateCodeModel.findOne({ user_id: userId })
    .select("code")
    .exec()
    .then((userCode) => {
      if (userCode) return res.json({ code: userCode.code });
      else throw new ServerError("not found", 404);
    })
    .catch((err) => {
      next(err);
    });
};
