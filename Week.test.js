import Week from './Week.js';
import MealEntry from './MealEntry.js';

describe('UC10: Week model tests', () => {
  let week;
  let breakfastMonday;

  beforeEach(() => {
    breakfastMonday = new MealEntry(1, 10, 'breakfast', 'Monday');
    week = new Week(15, [breakfastMonday]);
  });

  test('stores constructor values correctly', () => {
    expect(week.getWeekNumber()).toBe(15);
    expect(week.getMealEntries()).toHaveLength(1);
    expect(week.getMealEntries()[0].getMealId()).toBe(10);
  });

  test('addMeal adds a non-duplicate meal entry', () => {
    const lunchMonday = new MealEntry(2, 11, 'lunch', 'Monday');

    week.addMeal(lunchMonday);

    expect(week.getMealEntries()).toHaveLength(2);
    expect(week.getMealEntries()[1].getEntryId()).toBe(2);
    expect(week.getMealEntries()[1].getMealId()).toBe(11);
    expect(week.getMealEntries()[1].getMealType()).toBe('lunch');
  });

  test('addMeal throws on duplicate day and mealType slot', () => {
    const duplicateBreakfastMonday = new MealEntry(3, 12, 'breakfast', 'Monday');

    expect(() => {
      week.addMeal(duplicateBreakfastMonday);
    }).toThrow('addMeal: meal already exists in this slot');
  });

  test('addMeal throws on wrong argument type', () => {
    expect(() => {
      week.addMeal('not a MealEntry');
    }).toThrow('addMeal: argument must be a MealEntry instance');
  });

  test('removeMeal removes entry by id', () => {
    week.removeMeal(1);

    expect(week.getMealEntries()).toHaveLength(0);
  });

  test('removeMeal throws if id is not found', () => {
    expect(() => {
      week.removeMeal(999);
    }).toThrow('removeMeal: no entry found with id 999');
  });
});