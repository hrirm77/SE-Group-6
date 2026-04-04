import MealEntry from './MealEntry.js';

class CalendarService {
  constructor(calendars = [], validMealIds = []) {
    this._calendars = calendars;
    this._validMealIds = validMealIds;
  }

  openCalendar(calendarId, weekNo) {
    if (calendarId === '' || calendarId === null || calendarId === undefined) {
      return { success: false, message: 'Calendar ID is required' };
    }

    if (weekNo === '' || weekNo === null || weekNo === undefined) {
      return { success: false, message: 'Week number is required' };
    }

    const parsedWeek = Number(weekNo);

    if (!Number.isInteger(parsedWeek)) {
      return { success: false, message: 'Invalid week number format' };
    }

    if (parsedWeek < 1 || parsedWeek > 52) {
      return { success: false, message: 'Invalid week number' };
    }

    const calendar = this._calendars.find(
      (c) => c.getCalendarId() === Number(calendarId)
    );

    if (!calendar) {
      return { success: false, message: 'Calendar not found' };
    }

    const week = calendar.getWeek(parsedWeek);

    return {
      success: true,
      message: 'Calendar opened',
      entries: week ? week.getMealEntries() : []
    };
  }

  addMealToCalendar(calendarId, entry, weekNo) {
    if (entry === null || entry === undefined) {
      return { success: false, message: 'Meal entry is required' };
    }

    if (!(entry instanceof MealEntry)) {
      throw new Error('Argument must be a MealEntry instance');
    }

    if (weekNo === '' || weekNo === null || weekNo === undefined) {
      return { success: false, message: 'Week number is required' };
    }

    const parsedWeek = Number(weekNo);

    if (!Number.isInteger(parsedWeek)) {
      return { success: false, message: 'Invalid week number format' };
    }

    if (parsedWeek < 1 || parsedWeek > 52) {
      return { success: false, message: 'Invalid week number' };
    }

    const calendar = this._calendars.find(
      (c) => c.getCalendarId() === Number(calendarId)
    );

    if (!calendar) {
      return { success: false, message: 'Calendar not found' };
    }

    if (!this._validMealIds.includes(entry.getMealId())) {
      return { success: false, message: 'Meal not found in the system' };
    }

    try {
      const weekAlreadyExists = calendar.getWeek(parsedWeek) !== null;
      calendar.addMealEntry(entry, parsedWeek);

      return {
        success: true,
        message: weekAlreadyExists
          ? 'Meal entry added successfully'
          : 'Week created and meal entry added successfully'
      };
    } catch (error) {
      if (error.message === 'addMeal: meal already exists in this slot') {
        return { success: false, message: 'Meal already exists in this slot' };
      }
      throw error;
    }
  }
}

export default CalendarService;