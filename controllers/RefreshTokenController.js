const UserModel = require("../models/User");

const jwt = require("jsonwebtoken");
const { array } = require("joi");
require("dotenv").config();

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(403);
  }
  const refreshToken = cookies.jwt;
  console.log(refreshToken);

  const foundUser = await UserModel.findOne({ refreshToken: refreshToken });
  console.log(foundUser);

  if (!foundUser) {
    return res.sendStatus(401); // unauthorized
  }

  // compare jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.username) {
      const foundUserRoles = foundUser.roles;
      const jwtPayload = {
        UserInfo: {
          username: decoded.email,
          roles: foundUserRoles,
        },
      };
      return res.sendStatus(403);
    }
    const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "3m",
    });
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
