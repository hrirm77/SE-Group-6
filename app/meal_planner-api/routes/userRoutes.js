const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  setNutritionGoals,
  clearNutritionGoals,
  updateProfile,
  requestPasswordReset,
  resetPassword
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

router.post("/nutrition", protect, setNutritionGoals);
router.delete("/nutrition", protect, clearNutritionGoals);
router.post("/reset-password", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
