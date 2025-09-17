// src/components/calculator/MealPlan.tsx

import { Utensils } from 'lucide-react';
import { MealSuggestion } from '@/types'; // <-- ALTERAÇÃO AQUI

interface MealPlanProps {
  plan: MealSuggestion[];
}

export const MealPlan = ({ plan }: MealPlanProps) => {
  return (
    <div className="space-y-4 p-1">
      <h3 className="text-lg font-semibold text-foreground mb-4">Exemplo de Plano Alimentar</h3>
      {plan.map((meal, index) => (
        <div key={index} className="p-4 bg-background/50 rounded-lg border">
          <h4 className="font-bold text-foreground mb-3 flex items-center">
            <Utensils className="w-4 h-4 mr-2 text-blue-500" />
            {meal.mealName}
          </h4>
          <div className="flex flex-col space-y-2 text-sm">
            {meal.proteinSource && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{meal.proteinSource.name}</span>
                <span className="font-semibold text-primary">{meal.proteinSource.amount}g</span>
              </div>
            )}
            {meal.carbSource && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{meal.carbSource.name}</span>
                <span className="font-semibold text-secondary">{meal.carbSource.amount}g</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};