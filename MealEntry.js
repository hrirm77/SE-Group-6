/**
 * MealEntry Model
 * Represents one scheduled meal entry in a calendar week.
 * UC10 (Add Meal to Calendar)
 * @author Michael + Advaith
 */
class MealEntry {
  /**
   * @param {number} entryId
   * @param {number} mealId
   * @param {string} mealType
   * @param {string} day
   */
  constructor(entryId, mealId, mealType, day) {
    this._entryId  = entryId;
    this._mealId   = mealId;
    this._mealType = mealType;
    this._day      = day;
  }

  getEntryId()  { return this._entryId; }
  getMealId()   { return this._mealId; }
  getMealType() { return this._mealType; }
  getDay()      { return this._day; }
}

export default MealEntry;