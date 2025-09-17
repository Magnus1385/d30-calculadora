import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, User } from 'lucide-react';

interface CalculationFormProps {
  weight: string;
  objective: string;
  activityLevel: string;
  objectives: { [key: string]: { label: string } };
  activityMultipliers: { [key: string]: { label: string } };
  onWeightChange: (value: string) => void;
  onObjectiveChange: (value: string) => void;
  onActivityLevelChange: (value: string) => void;
  onCalculate: () => void;
  onReset: () => void;
}

export const CalculationForm = ({
  weight,
  objective,
  activityLevel,
  objectives,
  activityMultipliers,
  onWeightChange,
  onObjectiveChange,
  onActivityLevelChange,
  onCalculate,
  onReset
}: CalculationFormProps) => {
  return (
    <Card className="shadow-card bg-gradient-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5 text-primary" /> <span>Dados Pessoais</span>
        </CardTitle>
        <CardDescription>Insira seus dados para um cálculo personalizado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Peso corporal (kg)</label>
          <Input type="number" placeholder="Ex: 70" value={weight} onChange={(e) => onWeightChange(e.target.value)} className="bg-background border-border"/>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Objetivo</label>
          <Select value={objective} onValueChange={onObjectiveChange}>
            <SelectTrigger className="bg-background border-border"><SelectValue placeholder="Selecione seu objetivo" /></SelectTrigger>
            <SelectContent>
              {Object.entries(objectives).map(([key, value]) => (<SelectItem key={key} value={key}>{value.label}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nível de atividade física</label>
          <Select value={activityLevel} onValueChange={onActivityLevelChange}>
            <SelectTrigger className="bg-background border-border"><SelectValue placeholder="Selecione seu nível" /></SelectTrigger>
            <SelectContent>
              {Object.entries(activityMultipliers).map(([key, value]) => (<SelectItem key={key} value={key}>{value.label}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button onClick={onCalculate} className="flex-1" variant="gradient">
            <Calculator className="w-4 h-4 mr-2" /> Calcular
          </Button>
          <Button onClick={onReset} variant="outline" className="px-6">Limpar</Button>
        </div>
      </CardContent>
    </Card>
  );
};