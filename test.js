const mongoose = require('mongoose');
const RoleModel = require('./models/Roles');
const bcrypt = require("bcryptjs");


const mongoURI = "mongodb://127.0.0.1:27017/bug-tracker";
mongoose.connect(mongoURI);
const db = mongoose.connection;
db.on("error", () => {
  console.log("error");
});

db.once("open", () => {
  console.log("DB Connected");
});


// const seed_user = {name:test, email: "test@test.com", password:1234,};
const hashedPassword =  bcrypt.hash('1234', 10).then((p)=>console.log(p));

let defaultUserRole;
RoleModel.find({role_name: 'User'})
.then((role) => {
  defaultUserRole = role;
  console.log(defaultUserRole);
});




/* const seed_users = [
    {
        first_name: "Natan",
        last_name: "Gershbein",
        birthday: "08/03/1997",
        marital_status: "Single"
    },
    {
        first_name: "Avi",
        last_name: "Levi",
        birthday: "01/01/1993",
        marital_status: "Married"
    }
];
User.insertMany(seed_users)
.then(res => {console.log(res);})
.catch(err => {console.log(err);}); */
/* seed_user.save(function(error){
    if(error){
        console.log(error);
    }
    else {
        console.log("user was saved to DB");
        seed_user.ShowData();
    }
}); */

