import Calendar from './Calendar.js';
import Week from './Week.js';
import MealEntry from './MealEntry.js';

describe('UC3 and UC10: Calendar model tests', () => {
  let calendar;
  let breakfastEntry;
  let lunchEntry;

  beforeEach(() => {
    breakfastEntry = new MealEntry(1, 10, 'breakfast', 'Monday');
    lunchEntry = new MealEntry(2, 11, 'lunch', 'Monday');

    const week15 = new Week(15, [breakfastEntry]);
    calendar = new Calendar(100, [week15]);
  });

  test('stores constructor values correctly', () => {
    expect(calendar.getCalendarId()).toBe(100);
    expect(calendar.getWeeks()).toHaveLength(1);
    expect(calendar.getWeeks()[0].getWeekNumber()).toBe(15);
  });

  test('getWeek returns existing week', () => {
    const week = calendar.getWeek(15);

    expect(week).not.toBeNull();
    expect(week.getWeekNumber()).toBe(15);
    expect(week.getMealEntries()).toHaveLength(1);
    expect(week.getMealEntries()[0].getMealId()).toBe(10);
  });

  test('getWeek returns null when week does not exist', () => {
    const week = calendar.getWeek(40);

    expect(week).toBeNull();
  });

  test('addMealEntry adds meal to existing week', () => {
    calendar.addMealEntry(lunchEntry, 15);

    const week = calendar.getWeek(15);
    expect(week.getMealEntries()).toHaveLength(2);
    expect(week.getMealEntries()[1].getMealId()).toBe(11);
    expect(week.getMealEntries()[1].getMealType()).toBe('lunch');
  });

  test('addMealEntry creates a new week if needed', () => {
    const dinnerEntry = new MealEntry(3, 12, 'dinner', 'Tuesday');

    calendar.addMealEntry(dinnerEntry, 42);

    const newWeek = calendar.getWeek(42);
    expect(newWeek).not.toBeNull();
    expect(newWeek.getWeekNumber()).toBe(42);
    expect(newWeek.getMealEntries()).toHaveLength(1);
    expect(newWeek.getMealEntries()[0].getMealId()).toBe(12);
  });

  test('addMealEntry throws error for wrong argument type', () => {
    expect(() => {
      calendar.addMealEntry('not a MealEntry', 15);
    }).toThrow('addMealEntry: argument must be a MealEntry instance');
  });

  test('addMealEntry throws error for duplicate slot in same week', () => {
    const duplicateBreakfast = new MealEntry(5, 99, 'breakfast', 'Monday');

    expect(() => {
      calendar.addMealEntry(duplicateBreakfast, 15);
    }).toThrow('addMeal: meal already exists in this slot');
  });

  test('removeMealEntry removes matching entry from the correct week', () => {
    calendar.removeMealEntry(1);

    const week = calendar.getWeek(15);
    expect(week.getMealEntries()).toHaveLength(0);
  });

  test('removeMealEntry throws if entry id does not exist', () => {
    expect(() => {
      calendar.removeMealEntry(999);
    }).toThrow('removeMealEntry: no entry found with id 999');
  });
});

describe('UC11: Calendar editMealEntry tests', () => {
  let calendar;

  beforeEach(() => {
    const breakfast = new MealEntry(1, 10, 'breakfast', 'Monday');
    const week15 = new Week(15, [breakfast]);
    calendar = new Calendar(100, [week15]);
  });

  test('editMealEntry updates an existing entry', () => {
    const updated = new MealEntry(1, 99, 'lunch', 'Tuesday');

    calendar.editMealEntry(1, updated);

    const entry = calendar.getWeek(15).getMealEntries()[0];
    expect(entry.getMealId()).toBe(99);
    expect(entry.getMealType()).toBe('lunch');
    expect(entry.getDay()).toBe('Tuesday');
  });

  test('editMealEntry throws when entry id does not exist', () => {
    const updated = new MealEntry(1, 10, 'breakfast', 'Monday');

    expect(() => {
      calendar.editMealEntry(999, updated);
    }).toThrow('editMealEntry: no entry found with id 999');
  });
});