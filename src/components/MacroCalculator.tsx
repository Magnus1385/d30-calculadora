import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Componentes da UI
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculationForm } from './calculator/CalculationForm';
import { MacroResults } from './calculator/MacroResults';
import { MealPlan } from './calculator/MealPlan';
import { FoodSuggestions } from './calculator/FoodSuggestions';
import { ExerciseSuggestions } from './calculator/ExerciseSuggestions';

// Ícones
import { Calculator, LogOut, Download } from 'lucide-react';

// Importando os tipos do nosso ficheiro centralizado
import {
  MacroCalculatorProps,
  MacroResults as MacroResultsType, // Renomeando para evitar conflito com o nome do componente
  Food,
  Exercise,
  MealSuggestion
} from '@/types';

// --- Componente Orquestrador ---
const MacroCalculator = ({ onLogout }: MacroCalculatorProps) => {
  // --- Gestão de Estado ---
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [objective, setObjective] = useState('');
  
  const [results, setResults] = useState<MacroResultsType | null>(null);
  const [mealPlan, setMealPlan] = useState<MealSuggestion[]>([]);
  const [recommendedFoods, setRecommendedFoods] = useState<Food[]>([]);
  const [recommendedExercises, setRecommendedExercises] = useState<Exercise[]>([]);
  
  const [foodDatabase, setFoodDatabase] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  // --- Constantes de Configuração da Lógica de Negócio ---
  const objectives = {
    lose: { calorieMultiplier: 0.85, proteinMultiplier: 1.1, carbMultiplier: 0.8, label: 'Perder peso' },
    maintain: { calorieMultiplier: 1.0, proteinMultiplier: 1.0, carbMultiplier: 1.0, label: 'Manter peso' },
    gain: { calorieMultiplier: 1.15, proteinMultiplier: 1.0, carbMultiplier: 1.2, label: 'Ganhar peso/massa muscular' }
  };

  const activityMultipliers = {
    sedentary: { protein: 1.6, carbs: 3, label: 'Sedentário (pouco ou nenhum exercício)' },
    light: { protein: 1.8, carbs: 3.5, label: 'Levemente ativo (exercício leve 1-3x/semana)' },
    moderate: { protein: 2.0, carbs: 4, label: 'Moderadamente ativo (exercício moderado 3-5x/semana)' },
    high: { protein: 2.2, carbs: 5, label: 'Muito ativo (exercício intenso 6-7x/semana)' }
  };

  // --- Efeitos Laterais (Data Fetching) ---
  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const response = await fetch('/api.json');
        if (!response.ok) {
          throw new Error(`Erro na rede: Status ${response.status}`);
        }
        const data = await response.json();
        setFoodDatabase(data.foods);
      } catch (err: any) {
        console.error("Falha ao buscar dados dos alimentos:", err);
        setError(`Não foi possível carregar os dados. Detalhe: ${err.message}`);
        toast({
          title: "Erro ao Carregar Dados",
          description: "Não foi possível buscar a lista de alimentos.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchFoodData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Funções de Lógica de Negócio ---
  const getRecommendedFoods = (currentObjective: string): Food[] => {
    if (isLoading || error || foodDatabase.length === 0) return [];
    const filteredFoods = foodDatabase.filter(food => food.suitability?.includes(currentObjective as any));
    return filteredFoods.sort(() => 0.5 - Math.random());
  };

  const getRecommendedExercises = (currentObjective: string): Exercise[] => {
    if (currentObjective === 'lose') return [{ name: 'Corrida ou Caminhada', description: '30-45 min, 3-5x/semana. Ótimo para queima calórica.' }, { name: 'Treino HIIT', description: '15-20 min, 2-3x/semana. Acelera o metabolismo.' }];
    if (currentObjective === 'gain') return [{ name: 'Agachamento Livre', description: '3-4 séries de 6-10 repetições. Foco em progressão de carga.' }, { name: 'Supino Reto', description: '3-4 séries de 6-10 repetições. Essencial para peitoral, ombros e tríceps.' }];
    return [{ name: 'Treinamento Funcional', description: '3x/semana. Melhora a força e a resistência geral.' }];
  };

  const generateMealPlan = (currentResults: MacroResultsType, foodDb: Food[]): MealSuggestion[] => {
    const { protein, carbs } = currentResults;
    const proteinPerMeal = protein / 3;
    const carbsPerMeal = carbs / 3;

    const proteinFoods = foodDb.filter(f => f.type === 'protein' && f.protein > 0);
    const carbFoods = foodDb.filter(f => f.type === 'carb' && f.carbs > 0);
    if(proteinFoods.length === 0 || carbFoods.length === 0) return [];

    const plan: MealSuggestion[] = [];
    const mealNames = ['Refeição 1 (Ex: Café da Manhã/Almoço)', 'Refeição 2 (Ex: Almoço/Jantar)', 'Refeição 3 (Ex: Jantar/Ceia)'];

    for (let i = 0; i < 3; i++) {
      const randomProteinFood = proteinFoods[Math.floor(Math.random() * proteinFoods.length)];
      const randomCarbFood = carbFoods[Math.floor(Math.random() * carbFoods.length)];
      
      const proteinAmount = (proteinPerMeal / randomProteinFood.protein) * 100;
      const carbAmount = (carbsPerMeal / randomCarbFood.carbs) * 100;

      plan.push({
        mealName: mealNames[i],
        proteinSource: { name: randomProteinFood.name, amount: Math.round(proteinAmount) },
        carbSource: { name: randomCarbFood.name, amount: Math.round(carbAmount) },
      });
    }
    return plan;
  };
  
  const calculateMacros = () => {
    if (!weight || !activityLevel || !objective) {
      toast({ title: "Dados incompletos", description: "Por favor, preencha todos os campos.", variant: "destructive" });
      return;
    }
    const weightNum = parseFloat(weight);
    if (weightNum <= 0 || weightNum > 300) {
      toast({ title: "Peso inválido", description: "Digite um peso válido entre 1 e 300 kg.", variant: "destructive" });
      return;
    }

    const multiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers];
    const objectiveData = objectives[objective as keyof typeof objectives];
    
    const baseProtein = weightNum * multiplier.protein * objectiveData.proteinMultiplier;
    const baseCarbs = weightNum * multiplier.carbs * objectiveData.carbMultiplier;
    const baseFat = weightNum * 1;
    
    const protein = baseProtein;
    const carbs = baseCarbs;
    const calories = ((protein * 4) + (carbs * 4) + (baseFat * 9)) * objectiveData.calorieMultiplier;

    const proteinRange = `${(weightNum * 1.6).toFixed(0)}-${(weightNum * 2.2).toFixed(0)}g`;
    const carbsRange = `${(weightNum * 3).toFixed(0)}-${(weightNum * 5).toFixed(0)}g`;

    const finalResults = { protein, carbs, calories, proteinRange, carbsRange };
    
    setResults(finalResults);
    setRecommendedFoods(getRecommendedFoods(objective));
    setRecommendedExercises(getRecommendedExercises(objective));
    if (foodDatabase.length > 0) {
      setMealPlan(generateMealPlan(finalResults, foodDatabase));
    }

    toast({ title: "Cálculo realizado!", description: "Seu plano completo foi gerado abaixo." });
  };

  const resetCalculation = () => {
    setWeight('');
    setActivityLevel('');
    setObjective('');
    setResults(null);
    setMealPlan([]);
    setRecommendedFoods([]);
    setRecommendedExercises([]);
  };

  const generatePDF = () => {
    if (!results) {
      toast({ title: "Dados insuficientes", description: "Calcule um plano antes de gerar o PDF.", variant: "destructive" });
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Seu Plano de Macros Personalizado", pageWidth / 2, 20, { align: 'center' });

    autoTable(doc, {
      startY: 30,
      head: [['Resumo Diário de Macronutrientes', '']],
      body: [
        ['Calorias Totais', `~${results.calories.toFixed(0)} kcal`],
        ['Proteínas Totais', `${results.protein.toFixed(0)}g (Faixa: ${results.proteinRange})`],
        ['Carboidratos Totais', `${results.carbs.toFixed(0)}g (Faixa: ${results.carbsRange})`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [22, 163, 74], fontSize: 14 },
    });

    autoTable(doc, {
      head: [['Plano de Refeições Sugerido', 'Alimento (Proteína)', 'Qtd.', 'Alimento (Carboidrato)', 'Qtd.']],
      body: mealPlan.map(meal => [
        meal.mealName,
        meal.proteinSource?.name || '-',
        meal.proteinSource ? `${meal.proteinSource.amount}g` : '-',
        meal.carbSource?.name || '-',
        meal.carbSource ? `${meal.carbSource.amount}g` : '-',
      ]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], fontSize: 14 },
    });

    autoTable(doc, {
      head: [['Exercícios Recomendados', 'Descrição']],
      body: recommendedExercises.map(ex => [ex.name, ex.description]),
      theme: 'grid',
      headStyles: { fillColor: [217, 119, 6], fontSize: 14 },
    });

    const proteinSources = recommendedFoods.filter(f => f.type === 'protein');
    const carbSources = recommendedFoods.filter(f => f.type === 'carb');

    autoTable(doc, {
      head: [['Sugestões de Proteínas', 'Valor Nutricional (por porção)']],
      body: proteinSources.map(food => [food.name, `${food.protein}g de proteína (${food.amount})`]),
      theme: 'striped',
      headStyles: { fillColor: [219, 39, 119], fontSize: 14 },
    });

     autoTable(doc, {
      head: [['Sugestões de Carboidratos', 'Valor Nutricional (por porção)']],
      body: carbSources.map(food => [food.name, `${food.carbs}g de carboidratos (${food.amount})`]),
      theme: 'striped',
      headStyles: { fillColor: [107, 33, 168], fontSize: 14 },
    });

    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Este é um plano de exemplo gerado automaticamente. Consulte um profissional de nutrição.", pageWidth / 2, finalY + 15, { align: 'center' });

    doc.save("plano-alimentar-completo.pdf");
  };

  // --- Renderização ---
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Carregando dados...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 text-center p-4"><p><b>Erro:</b> {error}</p></div>;

  return (
    <div className="min-h-screen bg-background font-ui">
      <header className="bg-gradient-primary shadow-elegant">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Calculadora de Macronutrientes</h1>
            </div>
            <Button onClick={onLogout} variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        <section className="grid gap-8 lg:grid-cols-2 items-start">
          <CalculationForm
            weight={weight}
            objective={objective}
            activityLevel={activityLevel}
            objectives={objectives}
            activityMultipliers={activityMultipliers}
            onWeightChange={setWeight}
            onObjectiveChange={setObjective}
            onActivityLevelChange={setActivityLevel}
            onCalculate={calculateMacros}
            onReset={resetCalculation}
          />
          {results && <MacroResults results={results} />}
        </section>

        {results && (
          <section className="animate-fade-in">
            <Tabs defaultValue="plan" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="plan">Plano de Exemplo</TabsTrigger>
                <TabsTrigger value="exercises">Exercícios</TabsTrigger>
                <TabsTrigger value="foods">Sugestões</TabsTrigger>
              </TabsList>
              <TabsContent value="plan" className="mt-4 bg-gradient-card border-0 rounded-lg p-6 shadow-card">
                  <MealPlan plan={mealPlan} />
              </TabsContent>
              <TabsContent value="exercises" className="mt-4 bg-gradient-card border-0 rounded-lg p-6 shadow-card">
                  <ExerciseSuggestions exercises={recommendedExercises} />
              </TabsContent>
              <TabsContent value="foods" className="mt-4 bg-gradient-card border-0 rounded-lg p-6 shadow-card">
                  <FoodSuggestions foods={recommendedFoods} />
              </TabsContent>
            </Tabs>
            
            <div className="mt-10 flex justify-center">
              <Button onClick={generatePDF} variant="gradient">
                <Download className="w-4 h-4 mr-2" /> Baixar Relatório Completo em PDF
              </Button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default MacroCalculator;