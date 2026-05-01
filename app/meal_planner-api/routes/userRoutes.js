const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  setNutritionGoals,
  requestPasswordReset,
  resetPassword
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

router.post("/nutrition", protect, setNutritionGoals);
router.post("/reset-password", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
