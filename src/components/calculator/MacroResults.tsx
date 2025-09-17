import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface MacroResultsProps {
  results: {
    protein: number;
    carbs: number;
    calories: number;
    proteinRange: string;
    carbsRange: string;
  };
}

export const MacroResults = ({ results }: MacroResultsProps) => {
  return (
    <Card className="shadow-card bg-gradient-card border-0 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-success" /> <span>Seus Macronutrientes</span>
        </CardTitle>
        <CardDescription>Valores diários estimados para seu objetivo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary-light rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{results.protein.toFixed(0)}g</div>
            <div className="text-sm text-primary/80">Proteínas</div>
            <div className="text-xs text-muted-foreground mt-1">Faixa: {results.proteinRange}</div>
          </div>
          <div className="bg-secondary-light rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{results.carbs.toFixed(0)}g</div>
            <div className="text-sm text-secondary/80">Carboidratos</div>
            <div className="text-xs text-muted-foreground mt-1">Faixa: {results.carbsRange}</div>
          </div>
        </div>
        <div className="bg-success-light rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-success">~{results.calories.toFixed(0)} kcal</div>
          <div className="text-sm text-success/80">Calorias estimadas</div>
        </div>
      </CardContent>
    </Card>
  );
};