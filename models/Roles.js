const mongoose = require('mongoose')

const RoleSchema = new mongoose.Schema({
    role_name: {type: String,},
    role_code: {type: Number,},
});


const RoleModel = mongoose.model("role", RoleSchema);

module.exports = RoleModel;