const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please add a name"],
    },
    email: {
      type: String,
      require: [true, "Please add a email"],
      unique: true,
    },
    password: {
      type: String,
      require: [true, "Please add a password"],
    },
    college: {
      type: String,
    },
    stream: {
      type: String,
    },
    
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", userSchema);
