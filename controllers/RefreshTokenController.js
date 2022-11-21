const UserModel = require("../models/User");

const jwt = require("jsonwebtoken");
const { array } = require("joi");
require("dotenv").config();

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;
  // delete cookie
  res.clearCookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  console.log(refreshToken);

  const foundUser = await UserModel.findOne({
    refreshToken: refreshToken,
  }).exec();
  console.log(foundUser);

  // detected  refresh token reuse
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.sendStatus(403); // Forbidden
        }
        const hackedUser = await UserModel.findOne({email: decoded.username}).exec();
        hackedUser.refreshToken = [];
        const results = await hackedUser().save();
        console.log(results);
      }
    );
    return res.sendStatus(403); // Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

  // compare jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      foundUser.refreshToken = [...newRefreshTokenArray];
      const results = await foundUser.save();
    }
    if (err || foundUser.email !== decoded.username) {
      return res.sendStatus(403);
    }

    // refresh token is still valid
    const foundUserRoles = foundUser.roles;
    const jwtPayload = {
      UserInfo: {
        username: decoded.email,
        roles: foundUserRoles,
      },
    };
    const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "10s",
    });


    const newRefreshToken = jwt.sign(
      { username: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      // { expiresIn: "1m" }
      { expiresIn: "1d" }
    );

    // refresh token - saving
    // await foundUser.updateOne({ refreshToken: refreshToken });
    foundUser.refreshToken = [...newRefreshToken, newRefreshToken];
    const results = await foundUser.save();

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    

    res.json({ roles: foundUserRoles ,accessToken });

    /* {
      const foundUserRoles = foundUser.roles;
      const jwtPayload = {
        UserInfo: {
          username: decoded.email,
          roles: foundUserRoles,
        },
      };
      return res.sendStatus(403);
    } */
  });
};

module.exports = { handleRefreshToken };
