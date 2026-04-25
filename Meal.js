/**
 * Meal Model
 * Represents a meal stored in the system that can be scheduled.
 * UC10 (Add Meal to Calendar)
 * @author Michael + Advaith
 */
class Meal {
  /**
   * @param {number} mealId
   * @param {string} name
   * @param {string[]} ingredients
   * @param {string[]} instructions
   */
  constructor(mealId, name, ingredients = [], instructions = []) {
    this._mealId       = mealId;
    this._name         = name;
    this._ingredients  = ingredients;
    this._instructions = instructions;
  }

  getMealId()       { return this._mealId; }
  getName()         { return this._name; }
  getIngredients()  { return this._ingredients; }
  getInstructions() { return this._instructions; }
}

export default Meal;