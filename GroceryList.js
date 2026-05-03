import GroceryItem from './GroceryItem.js';

/**
 * GroceryList Model
 * Represents a user-owned grocery list.
 * UC23-UC26
 */
class GroceryList {
  constructor(listId, userId, title = 'Grocery List', items = []) {
    this._listId = listId;
    this._userId = userId;
    this._title = title;
    this._items = items;
  }

  getListId() { return this._listId; }
  getUserId() { return this._userId; }
  getTitle() { return this._title; }
  getItems() { return this._items; }

  setTitle(title) { this._title = title; }
  setItems(items) { this._items = items; }

  addItem(item) {
    if (!(item instanceof GroceryItem)) {
      throw new Error('item argument must be a GroceryItem instance');
    }
    this._items.push(item);
  }

  removeItem(name) {
    this._items = this._items.filter((item) => item.getName() !== name);
  }

  isEmpty() {
    return this._items.length === 0;
  }
}

export default GroceryList;
