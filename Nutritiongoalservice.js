import MacroGoal      from './MacroGoal.js';
import NutritionGoal  from './NutritionGoal.js';

const CALORIE_MIN = 1000;
const CALORIE_MAX = 3500;

class NutritionGoalService {
  /**
   * @param {NutritionGoal[]} nutritionGoals - existing goals (acts as in-memory store)
   */
  constructor(nutritionGoals = []) {
    this._nutritionGoals = nutritionGoals;
    this._nextGoalId     = nutritionGoals.length + 1;
  }

  /**
   * Sets (or updates) the nutrition goal for a user.
   *
   * @param {number}    userId       - the authenticated user's ID
   * @param {number}    calorieGoal  - daily calorie target in kcal
   * @param {MacroGoal} macroGoal    - daily macronutrient targets
   * @returns {{ success: boolean, message: string }}
   */
  setNutritionGoals(userId, calorieGoal, macroGoal) {

    //  1. Validate Calorie Goal 
    if (calorieGoal === '' || calorieGoal === null || calorieGoal === undefined) {
      return { success: false, message: 'Calorie goal is required' };
    }

    if (!Number.isInteger(calorieGoal)) {
      return { success: false, message: 'Invalid calorie goal format' };
    }

    if (calorieGoal < CALORIE_MIN || calorieGoal > CALORIE_MAX) {
      return { success: false, message: 'Calorie goal must be between 1000 and 3500 kcal' };
    }

    //  2. Validate MacroGoal 
    if (macroGoal === null || macroGoal === undefined) {
      return { success: false, message: 'Macro goal is required' };
    }

    if (!(macroGoal instanceof MacroGoal)) {
      throw new Error('macroGoal argument must be a MacroGoal instance');
    }

    const { protein, carbs, fat } = {
      protein: macroGoal.getProtein(),
      carbs:   macroGoal.getCarbs(),
      fat:     macroGoal.getFat()
    };

    if (!Number.isInteger(protein) || !Number.isInteger(carbs) || !Number.isInteger(fat)) {
      return { success: false, message: 'Macro values must be integers' };
    }

    if (protein < 0 || carbs < 0 || fat < 0) {
      return { success: false, message: 'Macro values must be non-negative' };
    }

    //  3. Save or update 
    const existing = this._nutritionGoals.find((g) => g.getUserId() === userId);

    if (existing) {
      existing.setCalorieGoal(calorieGoal);
      existing.setMacroGoal(macroGoal);
      return { success: true, message: 'Nutrition goals updated successfully' };
    }

    const newGoal = new NutritionGoal(this._nextGoalId++, userId, calorieGoal, macroGoal);
    this._nutritionGoals.push(newGoal);
    return { success: true, message: 'Nutrition goals saved successfully' };
  }

  /**
   * Returns the stored NutritionGoal for the given user, or null.
   * @param {number} userId
   * @returns {NutritionGoal|null}
   */
  getNutritionGoal(userId) {
    return this._nutritionGoals.find((g) => g.getUserId() === userId) ?? null;
  }
}

export default NutritionGoalService;