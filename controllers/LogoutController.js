const UserModel = require("../models/User");

require("dotenv").config();

const handleLogout = async (req, res) => {
  //client must also to delete the accessToken

  const cookies = req.cookies;
  console.log(cookies.jwt);

  if (!cookies?.jwt) return res.sendStatus(204); // no content
  const refreshToken = cookies.jwt;

  // is refresh token in db?
  const foundUser = await UserModel.findOne({ refreshToken: refreshToken });

  if (!foundUser) {
    res.clearCookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.sendStatus(204);
  }
  // delete the refresh token in db
  await foundUser.updateOne({ refreshToken: "" });

  res.clearCookie("jwt", refreshToken, {
    httpOnly: true,
    // sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.sendStatus(204);
};

module.exports = { handleLogout };
