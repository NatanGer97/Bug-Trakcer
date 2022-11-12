const mongoose = require("mongoose");

const ActivationCodeSchema = new mongoose.Schema(
  {
    code: { type: String },
    user_id: { type: mongoose.SchemaTypes.ObjectId },
  },
  { timestamps: true }
);
const ActivateCodeModel = mongoose.model(
  "activation_code",
  ActivationCodeSchema
);
module.exports = ActivateCodeModel;
