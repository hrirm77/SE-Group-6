const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    nutritionGoals: {
      calorieGoal: { type: Number },
      protein: { type: Number },
      carbs: { type: Number },
      fat: { type: Number }
    },
    resetToken: {
      type: String
    },
    resetTokenExpiry: {
      type: Date
    },
    weight: {
      type: Number
    },
    dietaryPreferences: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
