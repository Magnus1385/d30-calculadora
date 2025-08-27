import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/LoginForm';
import MacroCalculator from '@/components/MacroCalculator';

const Index = () => {
  const { isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return <MacroCalculator onLogout={logout} />;
};

export default Index;
