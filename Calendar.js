/**
 * Calendar Model
 * Top-level container for all of a user's weekly meal plans.
 * UC3 (Open Calendar), UC10 (Add Meal to Calendar)
 * @author Michael + Advaith
 */
import Week from './Week.js';
import MealEntry from './MealEntry.js';

class Calendar {
  /**
   * @param {number} calendarId
   * @param {Week[]} weeks
   */
  constructor(calendarId, weeks = []) {
    this._calendarId = calendarId;
    this._weeks = weeks;
  }

  getCalendarId() {
    return this._calendarId;
  }

  getWeeks() {
    return this._weeks;
  }

  /**
   * Returns the Week matching weekNo, or null if not found.
   * @param {number} weekNo
   * @returns {Week|null}
   */
  getWeek(weekNo) {
    return this._weeks.find((w) => w.getWeekNumber() === weekNo) ?? null;
  }

  /**
   * Adds a MealEntry to the correct week (creates the week if needed).
   * @param {MealEntry} entry
   * @param {number} weekNo
   */
  addMealEntry(entry, weekNo) {
    if (!(entry instanceof MealEntry)) {
      throw new Error('addMealEntry: argument must be a MealEntry instance');
    }

    let week = this.getWeek(weekNo);
    if (!week) {
      week = new Week(weekNo);
      this._weeks.push(week);
    }

    week.addMeal(entry);
  }

  /**
   * Removes a MealEntry by ID from whichever week contains it.
   * @param {number} entryId
   */
  removeMealEntry(entryId) {
    for (const week of this._weeks) {
      try {
        week.removeMeal(entryId);
        return; // removed successfully
      } catch {
        // entry not in this week — keep looking
      }
    }

    throw new Error(`removeMealEntry: no entry found with id ${entryId}`);
  }

  editMealEntry(entryId, entry) {
    for (const week of this._weeks) {
      try {
        week.editMeal(entryId, entry);
        return;
      } catch (error) {
        if (error.message.startsWith('editMeal: no entry found')) {
          // entry not in this week — keep looking
          continue;
        }
        throw error;
      }
    }

    throw new Error(`editMealEntry: no entry found with id ${entryId}`);
  }
}

export default Calendar;