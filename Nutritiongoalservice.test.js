import NutritionGoalService from './NutritionGoalService.js';
import MacroGoal            from './MacroGoal.js';

describe('UC27: NutritionGoalService - Set Nutrition Goals', () => {
  let service;

  beforeEach(() => {
    service = new NutritionGoalService([]);
  });

  //  TC1: Valid calorie + Valid macro → Success 
  test('TC1 - saves nutrition goals when all inputs are valid', () => {
    const macro  = new MacroGoal(150, 200, 65);
    const result = service.setNutritionGoals(1, 2000, macro);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Nutrition goals saved successfully');
  });

  //  TC1b: Second save for same user → update path 
  test('TC1b - updates nutrition goals when user already has a saved goal', () => {
    const macro = new MacroGoal(150, 200, 65);
    service.setNutritionGoals(1, 2000, macro);

    const updatedMacro = new MacroGoal(180, 220, 70);
    const result       = service.setNutritionGoals(1, 2200, updatedMacro);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Nutrition goals updated successfully');

    const stored = service.getNutritionGoal(1);
    expect(stored.getCalorieGoal()).toBe(2200);
    expect(stored.getMacroGoal().getProtein()).toBe(180);
  });

  //  TC1c: Upper boundary calorie value (3500) is valid 
  test('TC1c - accepts calorie goal at upper boundary (3500 kcal)', () => {
    const macro  = new MacroGoal(200, 300, 100);
    const result = service.setNutritionGoals(1, 3500, macro);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Nutrition goals saved successfully');
  });

  //  TC1d: Lower boundary calorie value (1000) is valid 
  test('TC1d - accepts calorie goal at lower boundary (1000 kcal)', () => {
    const macro  = new MacroGoal(50, 100, 30);
    const result = service.setNutritionGoals(1, 1000, macro);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Nutrition goals saved successfully');
  });

  //  TC2: Valid calorie + Invalid macro (negative protein) → Error 
  test('TC2 - rejects macro goal with negative protein value', () => {
    const macro  = new MacroGoal(-50, 200, 65);
    const result = service.setNutritionGoals(1, 2000, macro);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Macro values must be non-negative');
  });

  //  TC2b: Valid calorie + Invalid macro (negative fat) → Error 
  test('TC2b - rejects macro goal with negative fat value', () => {
    const macro  = new MacroGoal(150, 200, -10);
    const result = service.setNutritionGoals(1, 2000, macro);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Macro values must be non-negative');
  });

  //  TC3: Valid calorie + Exceptional macro (null) → Error 
  test('TC3 - rejects null macro goal', () => {
    const result = service.setNutritionGoals(1, 2000, null);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Macro goal is required');
  });

  //  TC3b: Valid calorie + wrong type → throws 
  test('TC3b - throws when macro goal is not a MacroGoal instance', () => {
    expect(() => {
      service.setNutritionGoals(1, 2000, 'not a MacroGoal');
    }).toThrow('macroGoal argument must be a MacroGoal instance');
  });

  //  TC4: Invalid calorie (below 1000) + Valid macro → Error 
  test('TC4 - rejects calorie goal below minimum (500 kcal)', () => {
    const macro  = new MacroGoal(150, 200, 65);
    const result = service.setNutritionGoals(1, 500, macro);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Calorie goal must be between 1000 and 3500 kcal');
  });

  // TC4b: Invalid calorie (above 3500) + Valid macro → Error 
  test('TC4b - rejects calorie goal above maximum (4000 kcal)', () => {
    const macro  = new MacroGoal(150, 200, 65);
    const result = service.setNutritionGoals(1, 4000, macro);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Calorie goal must be between 1000 and 3500 kcal');
  });

  //  TC7: Exceptional calorie (null) + Valid macro → Error 
  test('TC7 - rejects null calorie goal', () => {
    const macro  = new MacroGoal(150, 200, 65);
    const result = service.setNutritionGoals(1, null, macro);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Calorie goal is required');
  });

  //  TC7b: Exceptional calorie (empty string) + Valid macro → Error 
  test('TC7b - rejects empty string as calorie goal', () => {
    const macro  = new MacroGoal(150, 200, 65);
    const result = service.setNutritionGoals(1, '', macro);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Calorie goal is required');
  });

  //  TC7c: Non-integer calorie (float) → Error 
  test('TC7c - rejects float as calorie goal', () => {
    const macro  = new MacroGoal(150, 200, 65);
    const result = service.setNutritionGoals(1, 2000.5, macro);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid calorie goal format');
  });
});