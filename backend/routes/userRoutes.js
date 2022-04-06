const express = require("express");
const router = express.Router();
const {
  registerUser,
  userProfile,
  loginUser,
  allUsers,
  mailer,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

router.get("/all", allUsers);
router.post("/register", registerUser);
router.get("/profile", protect, userProfile);
router.post("/login", loginUser);
router.post("/mail", mailer);

module.exports = router;
