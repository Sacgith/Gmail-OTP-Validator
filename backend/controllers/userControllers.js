const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const { response } = require("express");
const { json } = require("body-parser");

const mailer = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  console.log(email, code);
  console.log(req.body);
  const message =
    code.toString().length >= 3
      ? `OTP for email verification ${code}`
      : "You have successfully registered!";
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
    text: message.toString(),
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent:" + info.response);
    }
  });
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
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      college: user.college,
      stream: user.stream,
      degree: user.degree,
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
      college: user.college,
      stream: user.stream,
      degree: user.degree,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

const updateProfile=asyncHandler(async(req, res)=>{
  const {name, degree, stream, college}=req.body;
  const newProfile={
    name, degree, stream, college
  };
  const profile=await User.findOne({user:req.user.id});
  profile.unshift(newProfile);
  await profile.save();
  res.status(200);json(profile);
})

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
  mailer,
  allUsers,
  updateProfile,
  getProfile
};
