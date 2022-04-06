const express = require("express");
const router = express.Router();
const {
  registerUser,
  getProfile,
  loginUser,
  allUsers,
  mailer,
  updateProfile
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

router.get("/all", allUsers);
router.post("/register", registerUser);
router.get("/profile", protect, getProfile);
router.post("/login", loginUser);
router.post("/mail", mailer);
router.put('/update', updateProfile);

module.exports = router;
