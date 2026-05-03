import GroceryItem from './GroceryItem.js';
import GroceryList from './GroceryList.js';
import GroceryListService from './GroceryListService.js';

describe('UC23-UC26: GroceryListService tests', () => {
  let service;

  beforeEach(() => {
    const existingList = new GroceryList(1, 1, 'Grocery List', [
      new GroceryItem('rice', '2 cups', false),
      new GroceryItem('chicken', '1 lb', true)
    ]);

    service = new GroceryListService([existingList]);
  });

  test('TC1 - generates grocery list from valid meal ingredients', () => {
    const meals = [
      {
        name: 'Chicken Bowl',
        ingredients: '2 cups rice\n1 lb chicken\nspinach'
      }
    ];

    const result = service.generateFromMeals(1, meals);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Grocery list generated successfully');
    expect(result.groceryList.getItems()).toHaveLength(3);
    expect(result.groceryList.getItems()[0].getName()).toBe('rice');
    expect(result.groceryList.getItems()[0].getQuantity()).toBe('2 cups');
    expect(result.groceryList.getItems()[1].getName()).toBe('chicken');
    expect(result.groceryList.getItems()[1].getQuantity()).toBe('1 lb');
    expect(result.groceryList.getItems()[2].getName()).toBe('spinach');
  });

  test('TC2 - rejects grocery list generation when meals have no ingredients', () => {
    const meals = [{ name: 'Empty Meal', ingredients: '' }];

    const result = service.generateFromMeals(1, meals);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Add meal ingredients before generating a grocery list');
  });

  test('TC3 - edits grocery list title', () => {
    const result = service.editList(1, 1, 'Weekly Groceries', [
      new GroceryItem('rice', '2 cups', false)
    ]);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Grocery list updated successfully');
    expect(result.groceryList.getTitle()).toBe('Weekly Groceries');
    expect(result.groceryList.getTitle()).not.toBe('Grocery List');
  });

  test('TC4 - edits grocery list item name and quantity', () => {
    const result = service.editList(1, 1, 'Weekly Groceries', [
      new GroceryItem('brown rice', '3 cups', false)
    ]);

    expect(result.success).toBe(true);
    expect(result.groceryList.getItems()[0].getName()).toBe('brown rice');
    expect(result.groceryList.getItems()[0].getQuantity()).toBe('3 cups');
    expect(result.groceryList.getItems()[0].isChecked()).toBe(false);
  });

  test('TC5 - exports grocery list text with title and items', () => {
    const result = service.exportList(1, 1);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Grocery list exported successfully');
    expect(result.exportText).toContain('Grocery List');
    expect(result.exportText).toContain('[ ] 2 cups rice');
    expect(result.exportText).toContain('[x] 1 lb chicken');
  });

  test('TC6 - deletes existing grocery list', () => {
    const result = service.deleteList(1, 1);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Grocery list deleted successfully');
    expect(result.deletedId).toBe(1);
    expect(service.getGroceryList(1)).toBeNull();
  });

  test('TC7 - prevents another user from editing a grocery list', () => {
    const result = service.editList(2, 1, 'Unauthorized Edit', [
      new GroceryItem('rice', '2 cups', false)
    ]);

    expect(result.success).toBe(false);
    expect(result.message).toBe('User not authorized');
  });

  test('TC8 - handles missing grocery list ID', () => {
    const result = service.editList(1, 999, 'Missing List', [
      new GroceryItem('rice', '2 cups', false)
    ]);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Grocery list not found');
  });
});
