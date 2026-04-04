import Meal from './Meal.js';

describe('Meal model tests', () => {
  test('stores constructor values correctly', () => {
    const meal = new Meal(
      10,
      'Chicken Bowl',
      ['chicken', 'rice'],
      ['cook chicken', 'serve over rice']
    );

    expect(meal.getMealId()).toBe(10);
    expect(meal.getName()).toBe('Chicken Bowl');
    expect(meal.getIngredients()).toEqual(['chicken', 'rice']);
    expect(meal.getInstructions()).toEqual([
      'cook chicken',
      'serve over rice'
    ]);
  });
});