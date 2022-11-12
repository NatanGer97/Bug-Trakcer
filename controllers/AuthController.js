const UserModel = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MapIdsToRoleName } = require("../services/RoleService");
require("dotenv").config();

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Username and/or password are required!" });
  }

  const foundUser = await UserModel.findOne({ email: email }).exec();
  if (!foundUser) {
    return res
      .status(401)
      .json({ message: " user not found, please register" }); // unauthorized
  }

  if (!foundUser.is_active)
    return res
      .status(402)
      .json({ message: "user is not active, please activate" });

  // compare passwords
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    let foundUserRoles = foundUser.roles;

    foundUserRoles = await MapIdsToRoleName(foundUserRoles);

    // create jwt
    console.log(process.env.ACCESS_TOKEN_SECRET);
    const jwtPayload = {
      UserInfo: {
        username: foundUser.email,
        roles: foundUserRoles,
      },
    };

    const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { username: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // refresh token
    await foundUser.updateOne({ refreshToken: refreshToken });
    //maxAge:  hourPerDay * minutesPerHour, secondsPerMinutes
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      // sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
