const mongoose = require("mongoose");

const otpSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "Please add a email"],
      unique: true,
    },
    code: {
      type: String,
      require: [true, "Please add a password"],
    },
    expiresIn: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("OTP", otpSchema);
