const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [2, "Name should be minimum of 2 characters"],
  },

  team_leader: { type: mongoose.Schema.Types.ObjectId, required: true },

  team_members : [{type:mongoose.Schema.Types.ObjectId, ref: 'user'}]
}, {timestamps: true});

const TeamModel = mongoose.model('team', teamSchema);

module.exports = TeamModel;
