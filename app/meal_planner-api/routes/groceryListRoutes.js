const express = require("express");
const router = express.Router();
const {
  getGroceryLists,
  generateGroceryList,
  updateGroceryList,
  deleteGroceryList,
} = require("../controllers/groceryListController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getGroceryLists);
router.route("/generate").post(protect, generateGroceryList);
router.route("/:id").patch(protect, updateGroceryList).delete(protect, deleteGroceryList);

module.exports = router;
