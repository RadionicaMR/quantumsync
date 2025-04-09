import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al cargar la aplicación
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Comprobar si es el administrador
      if (email === 'mauriramosgs@gmail.com' && password === 'bere1603') {
        const adminUser: User = {
          email,
          name: 'Mauricio Ramos',
          isAdmin: true
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        return true;
      }
      
      // Aquí implementarías la autenticación real
      // Por ahora simulamos una autenticación simple
      // En una implementación real, esto se conectaría con una API o servicio de autenticación
      
      // Verificamos si el usuario existe en el "almacenamiento local" (simulación)
      const users = [
        { email: 'cliente@example.com', password: 'password123', name: 'Cliente Demo', isAdmin: false },
        { email: 'ana@example.com', password: 'ana12345', name: 'Ana García', isAdmin: false }
      ];
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const loggedUser: User = {
          email: foundUser.email,
          name: foundUser.name,
          isAdmin: foundUser.isAdmin
        };
        setUser(loggedUser);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    // No añadimos la navegación aquí, porque se manejará en el componente que llama a logout
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulación de registro
      // En una implementación real, esto se conectaría con una API o servicio de registro
      const newUser: User = {
        email,
        name,
        isAdmin: false
      };
      
      // Guardar el usuario en localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      return true;
    } catch (error) {
      console.error('Error during registration:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      register,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
