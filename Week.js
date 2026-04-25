/**
 * Week Model
 * Represents one numbered week in a calendar.
 * Stores all MealEntry objects for that week.
 * UC3 (Open Calendar), UC10 (Add Meal to Calendar)
 * @author Michael + Advaith
 */
import MealEntry from './MealEntry.js';

class Week {
  /**
   * @param {number} weekNumber
   * @param {MealEntry[]} mealEntries
   */
  constructor(weekNumber, mealEntries = []) {
    this._weekNumber = weekNumber;
    this._mealEntries = mealEntries;
  }

  getWeekNumber() { return this._weekNumber; }
  getMealEntries() { return this._mealEntries; }

  /**
   * Adds a MealEntry to this week.
   * Prevents duplicate day/type slots.
   * @param {MealEntry} entry
   */
  addMeal(entry) {
    if (!(entry instanceof MealEntry)) {
      throw new Error('addMeal: argument must be a MealEntry instance');
    }

    const duplicate = this._mealEntries.find(
      (m) =>
        m.getDay() === entry.getDay() &&
        m.getMealType() === entry.getMealType()
    );

    if (duplicate) {
      throw new Error('addMeal: meal already exists in this slot');
    }

    this._mealEntries.push(entry);
  }

  /**
   * Removes a MealEntry by ID.
   * @param {number} entryId
   */
  removeMeal(entryId) {
    const index = this._mealEntries.findIndex(
      (m) => m.getEntryId() === entryId
    );

    if (index === -1) {
      throw new Error(`removeMeal: no entry found with id ${entryId}`);
    }

    this._mealEntries.splice(index, 1);
  }

  editMeal(entryId, updatedEntry) {
    if (!(updatedEntry instanceof MealEntry)) {
      throw new Error('editMeal: argument must be a MealEntry instance');
    }

    const index = this._mealEntries.findIndex(
      (m) => m.getEntryId() === entryId
    );

    if (index === -1) {
      throw new Error(`editMeal: no entry found with id ${entryId}`);
    }

    this._mealEntries[index] = updatedEntry;
  }
}

export default Week;