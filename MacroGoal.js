class MacroGoal {
  /**
   * @param {number} protein  - grams of protein (non-negative integer)
   * @param {number} carbs    - grams of carbohydrates (non-negative integer)
   * @param {number} fat      - grams of fat (non-negative integer)
   */
  constructor(protein, carbs, fat) {
    this._protein = protein;
    this._carbs   = carbs;
    this._fat     = fat;
  }

  getProtein() { return this._protein; }
  getCarbs()   { return this._carbs;   }
  getFat()     { return this._fat;     }
}

export default MacroGoal;