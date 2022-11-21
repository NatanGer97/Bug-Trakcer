const UserModel = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MapIdsToRoleName } = require("../services/RoleService");
require("dotenv").config();

const handleLogin = async (req, res) => {
  const cookies = req.cookies;

  const { email, password } = req.body;
  console.log(req.body);
  // credentials test
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

  // user activation test
  if (!foundUser.is_active)
    return res
      .status(401)
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
        userId: foundUser._id,
        userName: foundUser.name,
        roles: foundUserRoles,
      },
    };

    const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, {
      // expiresIn: "15m",
      // for testing only

      expiresIn: "1d", 
    });

    // refresh token
    /*  const newRefreshToken = jwt.sign(
      { username: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      // { expiresIn: "1m" }
      { expiresIn: "1d" }
    ); */

    /*    const newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

      if (cookies?.jwt) {
        res.clearCookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        
      } */

    // refresh token - saving
    /*     foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
    await foundUser.save();
    // await foundUser.updateOne({ re: refreshToken });
    //maxAge:  hourPerDay * minutesPerHour, secondsPerMinutes
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      SameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); */

    res.json({ roles: foundUserRoles, accessToken, username: foundUser.name });
  } else {
    return res.status(401).json({ message: "invalid password" });
  }
};

module.exports = { handleLogin };
