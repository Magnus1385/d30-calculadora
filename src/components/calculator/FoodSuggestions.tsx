// src/components/calculator/FoodSuggestions.tsx

import { Apple, Beef } from 'lucide-react';
import { Food } from '@/types'; // <-- ALTERAÇÃO AQUI

interface FoodSuggestionsProps {
  foods: Food[];
}

export const FoodSuggestions = ({ foods }: FoodSuggestionsProps) => {
  const proteinSources = foods.filter(f => f.type === 'protein');
  const carbSources = foods.filter(f => f.type === 'carb');

  return (
    <div className="grid gap-8 lg:grid-cols-2 p-1">
      {/* Fontes de Proteína */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Beef className="w-5 h-5 mr-2 text-primary" />
            Sugestões de Proteínas
        </h3>
        <div className="space-y-3">
          {proteinSources.map((food, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-primary-light rounded-lg border"
            >
              <span className="font-medium text-primary text-sm">{food.name}</span>
              <span className="text-xs text-primary/80 whitespace-nowrap pl-2">
                {food.protein}g ({food.amount})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fontes de Carboidratos */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Apple className="w-5 h-5 mr-2 text-secondary" />
            Sugestões de Carboidratos
        </h3>
        <div className="space-y-3">
          {carbSources.map((food, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-secondary-light rounded-lg border"
            >
              <span className="font-medium text-secondary text-sm">{food.name}</span>
              <span className="text-xs text-secondary/80 whitespace-nowrap pl-2">
                {food.carbs}g ({food.amount})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};