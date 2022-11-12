const ServerError = require("./Errors/ServerError");
const UserModel = require("./models/User");


UserModel.findById("636ea51538da4ca62f77bcd8").exec().then((user) => {
  // if (!user) throw new ServerError(404, "404");
  console.log(user);
}).catch((err)=>{
  throw err;
})