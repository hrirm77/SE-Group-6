import MacroGoal from './MacroGoal.js';

class NutritionGoal {
  /**
   * @param {number}     goalId       - unique identifier for this goal record
   * @param {number}     userId       - the user who owns this goal
   * @param {number}     calorieGoal  - daily calorie target (kcal)
   * @param {MacroGoal}  macroGoal    - daily macronutrient targets
   */
  constructor(goalId, userId, calorieGoal, macroGoal) {
    this._goalId      = goalId;
    this._userId      = userId;
    this._calorieGoal = calorieGoal;
    this._macroGoal   = macroGoal;
  }

  getGoalId()      { return this._goalId;      }
  getUserId()      { return this._userId;       }
  getCalorieGoal() { return this._calorieGoal;  }
  getMacroGoal()   { return this._macroGoal;    }

  setCalorieGoal(calorieGoal) { this._calorieGoal = calorieGoal; }
  setMacroGoal(macroGoal)     { this._macroGoal   = macroGoal;   }
}

export default NutritionGoal;