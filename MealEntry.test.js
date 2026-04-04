import MealEntry from './MealEntry.js';

describe('MealEntry model tests', () => {
  test('stores constructor values correctly', () => {
    const entry = new MealEntry(2, 11, 'lunch', 'Monday');

    expect(entry.getEntryId()).toBe(2);
    expect(entry.getMealId()).toBe(11);
    expect(entry.getMealType()).toBe('lunch');
    expect(entry.getDay()).toBe('Monday');
  });
});