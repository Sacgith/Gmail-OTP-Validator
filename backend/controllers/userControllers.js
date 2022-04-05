const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const nodemailer = require("nodemailer");
const { response } = require("express");

const mailer = (email, options) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mailsender78612@gmail.com",
      pass: "Mail@send789",
    },
  });
  let mailOptions = {
    from: "mailsender78612@gmail.com",
    to: email,
    subject: "Verify Gmail for MERN",
    text: options.length?options:"You have successfully"
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent:" + info.response);
    }
  });
};

const emailSend = asyncHandler(async (req, res) => {
  const data = await User.findOne({ email: req.body.email });
  if (data) {
    await OTP.deleteMany({ email });
    let otpCode = Math.floor(1000 + Math.random() * 9000);
    console.log(otpCode);
    let otpData = new OTP({
      email,
      code: otpCode,
      expiresIn: Date.now() + 300 * 1000,
    });
    if (otpData) {
      await otpData.save();
      mailer(email, `OTP for gmail verification is ${otpCode}`);
      res.status(200).json({
        message: "Please Check your mail id",
      });
    }
  } else {
    res.status(400);
    throw new Error("Email Couldn't Sent");
  }
});
const verifyEmail = asyncHandler(async (req, res) => {
  const data = await OTP.find({
    email: req.body.email,
    code: req.body.code,
  });
  console.log(data.length);
  if (data.length == 0) {
    res.status(400);
    throw new Error("Invalid OTP or Email");
  } else {
    const expiresIn = data[0].expiresIn;
    let currentTime = Date.now();
    if (expiresIn - currentTime >= 0) {
      mailer(data[0].email, "You have successfully registered");
      res.status(200).json({ message: "Email verified" });
    } else {
      res.status(400);
      throw new Error("Token Expired");
    }
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all the fields");
  }
  //check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    let otpCode = Math.floor(1000 + Math.random() * 9000);
    console.log(otpCode);
    let otpData = new OTP({
      email,
      code: otpCode,
      expiresIn: Date.now() + 300 * 1000,
    });
    await otpData.save();
    mailer(email, `OTP for gmail verification is ${otpCode}`);

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

const userProfile = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);
  res.status(200).json({
    id: _id,
    name,
    email,
  });
});

const allUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

//Generate JwT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  userProfile,
  emailSend,
  verifyEmail,
  mailer,
  allUsers,
};
