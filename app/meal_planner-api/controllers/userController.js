const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
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
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
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
    throw new Error("Invalid credentials");
  }
});

// @desc    Get user data
// @route   Get /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Set Nutrition Goals
// @route   POST /api/users/nutrition
// @access  Private
const setNutritionGoals = asyncHandler(async (req, res) => {
  const { calorieGoal, protein, carbs, fat } = req.body;

  if (!calorieGoal || protein === undefined || carbs === undefined || fat === undefined) {
    res.status(400);
    throw new Error("Please provide all macro goals");
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.nutritionGoals = { calorieGoal, protein, carbs, fat };
  await user.save();

  res.status(200).json(user.nutritionGoals);
});

// @desc    Clear Nutrition Goals
// @route   DELETE /api/users/nutrition
// @access  Private
const clearNutritionGoals = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.nutritionGoals = undefined;
  await user.save();

  res.status(200).json({ message: "Nutrition goals cleared" });
});

// @desc    Update User Profile (Weight, Diet)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { weight, dietaryPreferences } = req.body;
  const user = await User.findById(req.user.id);
  
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (weight !== undefined) user.weight = weight;
  if (dietaryPreferences !== undefined) user.dietaryPreferences = dietaryPreferences;

  await user.save();
  res.status(200).json({
    weight: user.weight,
    dietaryPreferences: user.dietaryPreferences
  });
});

// @desc    Request Password Reset
// @route   POST /api/users/reset-password
// @access  Public
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Please provide an email");
  }

  const user = await User.findOne({ email });
  if (!user) {
    // Security best practice: return success even if user not found
    return res.status(200).json({ message: "If that email is registered, a reset link has been sent." });
  }

  // Generate a random 6-character token for simplicity in this project
  const token = Math.random().toString(36).substring(2, 8).toUpperCase();
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  // In a real app we would send an email. For this project, we'll return the token in the response for easy testing!
  res.status(200).json({
    message: "If that email is registered, a reset link has been sent.",
    token: token // Included for testing purposes without email service
  });
});

// @desc    Submit new password
// @route   POST /api/users/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const token = req.params.token;

  if (!password) {
    res.status(400);
    throw new Error("Please provide a new password");
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters");
  }

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.status(200).json({ message: "Password has been reset successfully" });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  setNutritionGoals,
  clearNutritionGoals,
  updateProfile,
  requestPasswordReset,
  resetPassword
};
