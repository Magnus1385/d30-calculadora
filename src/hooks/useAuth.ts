import { useState, useEffect } from 'react';

const DEFAULT_PASSWORD = 'kiwifi2024';
const AUTH_KEY = 'macronutrient-auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verificar se já está autenticado
    const authStatus = localStorage.getItem(AUTH_KEY);
    setIsAuthenticated(authStatus === 'true');
    setIsLoading(false);
  }, []);

  const login = (password: string): boolean => {
    // Senha configurável - pode ser alterada aqui
    const correctPassword = DEFAULT_PASSWORD;
    
    if (password === correctPassword) {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};