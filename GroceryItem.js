/**
 * GroceryItem Model
 * Represents one item in a generated grocery list.
 * UC23-UC26
 */
class GroceryItem {
  constructor(name, quantity = '', checked = false) {
    this._name = name;
    this._quantity = quantity;
    this._checked = checked;
  }

  getName() { return this._name; }
  getQuantity() { return this._quantity; }
  isChecked() { return this._checked; }

  setName(name) { this._name = name; }
  setQuantity(quantity) { this._quantity = quantity; }
  setChecked(checked) { this._checked = checked; }
  toggleChecked() { this._checked = !this._checked; }
}

export default GroceryItem;
