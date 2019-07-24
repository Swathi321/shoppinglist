const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String
  },
  tokenExpire: {
    type: Date
  },
  registerd_date: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("User", UserSchema);
