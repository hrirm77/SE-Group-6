const asyncHandler = require("express-async-handler");
const GroceryList = require("../models/groceryListModel");
const Meal = require("../models/mealModel");

const parseIngredientLine = (line) => {
  const cleaned = line.trim().replace(/^[-*]\s*/, "");

  if (!cleaned) {
    return null;
  }

  const quantityMatch = cleaned.match(
    /^((?:\d+\/\d+|\d+(?:\.\d+)?)(?:\s*-\s*(?:\d+\/\d+|\d+(?:\.\d+)?))?\s*(?:cups?|tbsp|tablespoons?|tsp|teaspoons?|oz|ounces?|lbs?|pounds?|g|grams?|kg|ml|l|liters?)?)\s+(.+)$/i
  );

  if (!quantityMatch) {
    return { name: cleaned, quantity: "", checked: false };
  }

  return {
    quantity: quantityMatch[1].trim(),
    name: quantityMatch[2].trim(),
    checked: false,
  };
};

const normalizeItems = (items = []) =>
  items
    .map((item) => ({
      name: String(item.name || "").trim(),
      quantity: String(item.quantity || "").trim(),
      checked: Boolean(item.checked),
    }))
    .filter((item) => item.name);

// @desc    Get grocery lists
// @route   GET /api/grocery-lists
// @access  Private
const getGroceryLists = asyncHandler(async (req, res) => {
  const lists = await GroceryList.find({ user: req.user.id }).sort({
    updatedAt: -1,
  });

  res.status(200).json(lists);
});

// @desc    Generate grocery list from meal ingredients
// @route   POST /api/grocery-lists/generate
// @access  Private
const generateGroceryList = asyncHandler(async (req, res) => {
  const meals = await Meal.find({ user: req.user.id });
  const items = meals.flatMap((meal) =>
    String(meal.ingredients || "")
      .split(/\r?\n/)
      .map(parseIngredientLine)
      .filter(Boolean)
  );

  if (!items.length) {
    res.status(400);
    throw new Error("Add meal ingredients before generating a grocery list");
  }

  const title =
    String(req.body.title || "").trim() ||
    `Grocery List ${new Date().toLocaleDateString("en-US")}`;

  const list = await GroceryList.create({
    user: req.user.id,
    title,
    items,
  });

  res.status(201).json(list);
});

// @desc    Update grocery list
// @route   PATCH /api/grocery-lists/:id
// @access  Private
const updateGroceryList = asyncHandler(async (req, res) => {
  const list = await GroceryList.findById(req.params.id);

  if (!list) {
    res.status(404);
    throw new Error("Grocery list not found");
  }

  if (list.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  list.title = String(req.body.title || list.title).trim();
  list.items = normalizeItems(req.body.items);

  const updatedList = await list.save();

  res.status(200).json(updatedList);
});

// @desc    Delete grocery list
// @route   DELETE /api/grocery-lists/:id
// @access  Private
const deleteGroceryList = asyncHandler(async (req, res) => {
  const list = await GroceryList.findById(req.params.id);

  if (!list) {
    res.status(404);
    throw new Error("Grocery list not found");
  }

  if (list.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await list.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getGroceryLists,
  generateGroceryList,
  updateGroceryList,
  deleteGroceryList,
};
