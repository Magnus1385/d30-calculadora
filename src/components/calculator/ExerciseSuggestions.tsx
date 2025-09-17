// src/components/calculator/ExerciseSuggestions.tsx

import { Dumbbell } from 'lucide-react';
import { Exercise } from '@/types'; // <-- ALTERAÇÃO AQUI

interface ExerciseSuggestionsProps {
  exercises: Exercise[];
}

export const ExerciseSuggestions = ({ exercises }: ExerciseSuggestionsProps) => {
  return (
    <div className="space-y-3 p-1">
        <h3 className="text-lg font-semibold text-foreground mb-4">Exercícios Recomendados</h3>
        {exercises.map((exercise, index) => (
            <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-bold text-green-800 flex items-center">
                <Dumbbell className="w-4 h-4 mr-2" />
                {exercise.name}
            </h4>
            <p className="text-sm text-green-700 mt-1">{exercise.description}</p>
            </div>
        ))}
    </div>
  );
};