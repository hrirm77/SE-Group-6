import CalendarService from './CalendarService.js';
import Calendar from './Calendar.js';
import Week from './Week.js';
import MealEntry from './MealEntry.js';

describe('CalendarService tests', () => {
  let calendarService;

  beforeEach(() => {
    const breakfast = new MealEntry(1, 10, 'breakfast', 'Monday');
    const week15 = new Week(15, [breakfast]);
    const calendar = new Calendar(100, [week15]);

    calendarService = new CalendarService([calendar], [10, 11, 12, 13, 14]);
  });

  test('open calendar with meals', () => {
    const result = calendarService.openCalendar(100, 15);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Calendar opened');
    expect(result.entries).toHaveLength(1);
  });

  test('open calendar empty week', () => {
    const result = calendarService.openCalendar(100, 40);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Calendar opened');
    expect(result.entries).toHaveLength(0);
  });

  test('invalid week number', () => {
    const result = calendarService.openCalendar(100, 55);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid week number');
  });

  test('calendar not found', () => {
    const result = calendarService.openCalendar(999, 15);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Calendar not found');
  });

  test('calendar id required', () => {
    const result = calendarService.openCalendar('', 15);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Calendar ID is required');
  });

  test('week number required', () => {
    const result = calendarService.openCalendar(100, '');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Week number is required');
  });

  test('invalid week format', () => {
    const result = calendarService.openCalendar(100, 'abc');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid week number format');
  });

  test('add meal to existing week', () => {
    const entry = new MealEntry(2, 11, 'lunch', 'Monday');
    const result = calendarService.addMealToCalendar(100, entry, 15);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Meal entry added successfully');
  });

  test('add meal to new week', () => {
    const entry = new MealEntry(3, 12, 'dinner', 'Tuesday');
    const result = calendarService.addMealToCalendar(100, entry, 42);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Week created and meal entry added successfully');
  });

  test('add meal invalid week number', () => {
    const entry = new MealEntry(4, 13, 'lunch', 'Wednesday');
    const result = calendarService.addMealToCalendar(100, entry, 55);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid week number');
  });

  test('meal not found in system', () => {
    const entry = new MealEntry(5, 999, 'breakfast', 'Monday');
    const result = calendarService.addMealToCalendar(100, entry, 15);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Meal not found in the system');
  });

  test('duplicate meal slot', () => {
    const entry = new MealEntry(6, 10, 'breakfast', 'Monday');
    const result = calendarService.addMealToCalendar(100, entry, 15);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Meal already exists in this slot');
  });

  test('null meal entry', () => {
    const result = calendarService.addMealToCalendar(100, null, 15);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Meal entry is required');
  });

  test('wrong meal entry type', () => {
    expect(() => {
      calendarService.addMealToCalendar(100, 'not a MealEntry', 15);
    }).toThrow('Argument must be a MealEntry instance');
  });

  test('add meal invalid week format', () => {
    const entry = new MealEntry(7, 14, 'dinner', 'Friday');
    const result = calendarService.addMealToCalendar(100, entry, 'abc');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid week number format');
  });
});