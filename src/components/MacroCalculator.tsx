import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, LogOut, User, Activity, Target, Apple, Beef } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MacroCalculatorProps {
  onLogout: () => void;
}

interface MacroResults {
  protein: number;
  carbs: number;
  calories: number;
  proteinRange: string;
  carbsRange: string;
}

const MacroCalculator = ({ onLogout }: MacroCalculatorProps) => {
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [results, setResults] = useState<MacroResults | null>(null);
  const { toast } = useToast();

  const activityMultipliers = {
    sedentary: { protein: 1.6, carbs: 3, label: 'Sedentário (pouco ou nenhum exercício)' },
    light: { protein: 1.8, carbs: 3.5, label: 'Levemente ativo (exercício leve 1-3x/semana)' },
    moderate: { protein: 2.0, carbs: 4, label: 'Moderadamente ativo (exercício moderado 3-5x/semana)' },
    high: { protein: 2.2, carbs: 5, label: 'Muito ativo (exercício intenso 6-7x/semana)' }
  };

  const proteinSources = [
    { name: 'Peito de frango', protein: 23, amount: '100g' },
    { name: 'Ovo inteiro', protein: 13, amount: '100g' },
    { name: 'Salmão', protein: 25, amount: '100g' },
    { name: 'Whey Protein', protein: 25, amount: '30g' },
    { name: 'Carne vermelha magra', protein: 26, amount: '100g' },
    { name: 'Queijo cottage', protein: 11, amount: '100g' }
  ];

  const carbSources = [
    { name: 'Arroz integral', carbs: 23, amount: '100g cozido' },
    { name: 'Batata doce', carbs: 20, amount: '100g' },
    { name: 'Aveia', carbs: 66, amount: '100g' },
    { name: 'Banana', carbs: 23, amount: '100g' },
    { name: 'Pão integral', carbs: 49, amount: '100g' },
    { name: 'Macarrão integral', carbs: 25, amount: '100g cozido' }
  ];

  const calculateMacros = () => {
    if (!weight || !activityLevel) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    const weightNum = parseFloat(weight);
    if (weightNum <= 0 || weightNum > 300) {
      toast({
        title: "Peso inválido",
        description: "Digite um peso válido entre 1 e 300 kg.",
        variant: "destructive"
      });
      return;
    }

    const multiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers];
    
    // Cálculos baseados nas diretrizes nutricionais
    const protein = weightNum * multiplier.protein;
    const carbs = weightNum * multiplier.carbs;
    const calories = (protein * 4) + (carbs * 4) + (weightNum * 1 * 9); // Assumindo 1g/kg de gordura

    const proteinRange = `${(weightNum * 1.6).toFixed(0)}-${(weightNum * 2.2).toFixed(0)}g`;
    const carbsRange = `${(weightNum * 3).toFixed(0)}-${(weightNum * 5).toFixed(0)}g`;

    setResults({
      protein,
      carbs,
      calories,
      proteinRange,
      carbsRange
    });

    toast({
      title: "Cálculo realizado!",
      description: "Seus macronutrientes foram calculados com sucesso.",
      variant: "default"
    });
  };

  const resetCalculation = () => {
    setWeight('');
    setActivityLevel('');
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-background font-ui">
      {/* Header */}
      <header className="bg-gradient-primary shadow-elegant">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">
                Calculadora de Macronutrientes
              </h1>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Formulário de Cálculo */}
          <Card className="shadow-card bg-gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <span>Dados Pessoais</span>
              </CardTitle>
              <CardDescription>
                Insira seus dados para calcular os macronutrientes ideais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Peso corporal (kg)
                </label>
                <Input
                  type="number"
                  placeholder="Ex: 70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Nível de atividade física
                </label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(activityMultipliers).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={calculateMacros}
                  className="flex-1"
                  variant="gradient"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calcular
                </Button>
                <Button 
                  onClick={resetCalculation}
                  variant="outline"
                  className="px-6"
                >
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resultados */}
          {results && (
            <Card className="shadow-card bg-gradient-card border-0 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-success" />
                  <span>Seus Macronutrientes</span>
                </CardTitle>
                <CardDescription>
                  Valores calculados para ganho de massa muscular
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-light rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {results.protein.toFixed(0)}g
                    </div>
                    <div className="text-sm text-primary/80">Proteínas</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Faixa: {results.proteinRange}
                    </div>
                  </div>
                  <div className="bg-secondary-light rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-secondary">
                      {results.carbs.toFixed(0)}g
                    </div>
                    <div className="text-sm text-secondary/80">Carboidratos</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Faixa: {results.carbsRange}
                    </div>
                  </div>
                </div>
                
                <div className="bg-success-light rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-success">
                    ~{results.calories.toFixed(0)} kcal
                  </div>
                  <div className="text-sm text-success/80">Calorias estimadas</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Exemplos de Alimentos */}
        <div className="grid gap-8 lg:grid-cols-2 mt-8">
          {/* Fontes de Proteína */}
          <Card className="shadow-card bg-gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Beef className="w-5 h-5 text-primary" />
                <span>Fontes de Proteína</span>
              </CardTitle>
              <CardDescription>
                Alimentos ricos em proteína para sua dieta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {proteinSources.map((food, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-3 bg-primary-light rounded-lg"
                  >
                    <span className="font-medium text-primary">{food.name}</span>
                    <span className="text-sm text-primary/80">
                      {food.protein}g ({food.amount})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fontes de Carboidratos */}
          <Card className="shadow-card bg-gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Apple className="w-5 h-5 text-secondary" />
                <span>Fontes de Carboidratos</span>
              </CardTitle>
              <CardDescription>
                Alimentos ricos em carboidratos para energia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {carbSources.map((food, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-3 bg-secondary-light rounded-lg"
                  >
                    <span className="font-medium text-secondary">{food.name}</span>
                    <span className="text-sm text-secondary/80">
                      {food.carbs}g ({food.amount})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MacroCalculator;