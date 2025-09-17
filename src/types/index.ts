// src/types/index.ts

export interface MacroCalculatorProps {
    onLogout: () => void;
  }
  
  export interface MacroResults {
    protein: number;
    carbs: number;
    calories: number;
    proteinRange: string;
    carbsRange: string;
  }
  
  export interface Food {
    name: string;
    protein: number;
    carbs: number;
    amount: string;
    type: 'protein' | 'carb';
    suitability?: ('lose' | 'maintain' | 'gain')[];
  }
  
  export interface Exercise {
    name: string;
    description: string;
  }
  
  export interface MealSuggestion {
    mealName: string;
    proteinSource?: { name: string; amount: number };
    carbSource?: { name: string; amount: number };
  }