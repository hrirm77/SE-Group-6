import GroceryItem from './GroceryItem.js';
import GroceryList from './GroceryList.js';

/**
 * GroceryListService
 * Handles UC23 Generate, UC24 Edit, UC25 Export, and UC26 Delete grocery list.
 */
class GroceryListService {
  constructor(groceryLists = []) {
    this._groceryLists = groceryLists;
    this._nextListId = groceryLists.length + 1;
  }

  generateFromMeals(userId, meals) {
    if (!Array.isArray(meals)) {
      return { success: false, message: 'Meals are required' };
    }

    const items = meals.flatMap((meal) => {
      const ingredients = this._getIngredientsFromMeal(meal);
      return ingredients.map((ingredient) => this._parseIngredient(ingredient)).filter(Boolean);
    });

    if (items.length === 0) {
      return {
        success: false,
        message: 'Add meal ingredients before generating a grocery list'
      };
    }

    const groceryList = new GroceryList(
      this._nextListId++,
      userId,
      'Grocery List',
      items
    );

    this._groceryLists.push(groceryList);

    return {
      success: true,
      message: 'Grocery list generated successfully',
      groceryList
    };
  }

  editList(userId, listId, title, items) {
    const groceryList = this._findOwnedList(userId, listId);

    if (groceryList.error) {
      return groceryList.error;
    }

    if (title === '' || title === null || title === undefined) {
      return { success: false, message: 'Grocery list title is required' };
    }

    if (!Array.isArray(items)) {
      return { success: false, message: 'Grocery list items are required' };
    }

    const normalizedItems = items.map((item) => {
      if (item instanceof GroceryItem) {
        return item;
      }

      return new GroceryItem(item.name, item.quantity, item.checked);
    });

    const hasInvalidItem = normalizedItems.some((item) => !item.getName());

    if (hasInvalidItem) {
      return { success: false, message: 'Grocery item name is required' };
    }

    groceryList.value.setTitle(title);
    groceryList.value.setItems(normalizedItems);

    return {
      success: true,
      message: 'Grocery list updated successfully',
      groceryList: groceryList.value
    };
  }

  exportList(userId, listId) {
    const groceryList = this._findOwnedList(userId, listId);

    if (groceryList.error) {
      return groceryList.error;
    }

    const itemLines = groceryList.value.getItems().map((item) => {
      const marker = item.isChecked() ? '[x]' : '[ ]';
      return `${marker} ${item.getQuantity()} ${item.getName()}`.replace(/\s+/g, ' ').trim();
    });

    return {
      success: true,
      message: 'Grocery list exported successfully',
      exportText: [groceryList.value.getTitle(), '', ...itemLines].join('\n')
    };
  }

  deleteList(userId, listId) {
    const groceryList = this._findOwnedList(userId, listId);

    if (groceryList.error) {
      return groceryList.error;
    }

    this._groceryLists = this._groceryLists.filter(
      (list) => list.getListId() !== Number(listId)
    );

    return {
      success: true,
      message: 'Grocery list deleted successfully',
      deletedId: Number(listId)
    };
  }

  getGroceryList(listId) {
    return this._groceryLists.find((list) => list.getListId() === Number(listId)) ?? null;
  }

  _findOwnedList(userId, listId) {
    if (listId === '' || listId === null || listId === undefined) {
      return { error: { success: false, message: 'Grocery list ID is required' } };
    }

    const groceryList = this.getGroceryList(listId);

    if (!groceryList) {
      return { error: { success: false, message: 'Grocery list not found' } };
    }

    if (groceryList.getUserId() !== userId) {
      return { error: { success: false, message: 'User not authorized' } };
    }

    return { value: groceryList };
  }

  _getIngredientsFromMeal(meal) {
    if (!meal) {
      return [];
    }

    const ingredients =
      typeof meal.getIngredients === 'function' ? meal.getIngredients() : meal.ingredients;

    if (Array.isArray(ingredients)) {
      return ingredients;
    }

    if (typeof ingredients === 'string') {
      return ingredients.split(/\r?\n/);
    }

    return [];
  }

  _parseIngredient(ingredient) {
    const cleaned = String(ingredient || '').trim().replace(/^[-*]\s*/, '');

    if (!cleaned) {
      return null;
    }

    const quantityMatch = cleaned.match(
      /^((?:\d+\/\d+|\d+(?:\.\d+)?)(?:\s*-\s*(?:\d+\/\d+|\d+(?:\.\d+)?))?\s*(?:cups?|tbsp|tablespoons?|tsp|teaspoons?|oz|ounces?|lbs?|pounds?|g|grams?|kg|ml|l|liters?)?)\s+(.+)$/i
    );

    if (!quantityMatch) {
      return new GroceryItem(cleaned, '', false);
    }

    return new GroceryItem(quantityMatch[2].trim(), quantityMatch[1].trim(), false);
  }
}

export default GroceryListService;
