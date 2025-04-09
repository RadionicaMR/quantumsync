
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
      
      // Acceso especial para el usuario específico
      if (email === 'germancastroc25@gmail.com' && password === 'german2025') {
        const specialUser: User = {
          email,
          name: 'German Castro',
          isAdmin: false
        };
        setUser(specialUser);
        localStorage.setItem('user', JSON.stringify(specialUser));
        return true;
      }
      
      // Verificar si el usuario existe en la lista de usuarios
      const storedUsersList = localStorage.getItem('usersList');
      
      if (storedUsersList) {
        const usersList = JSON.parse(storedUsersList);
        console.log("Lista de usuarios:", usersList);
        
        // Comparación sin distinguir mayúsculas y minúsculas para el email
        const foundUser = usersList.find((u: any) => 
          u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        
        console.log("Usuario encontrado:", foundUser);
        
        if (foundUser) {
          const loggedUser: User = {
            email: foundUser.email,
            name: foundUser.name,
            isAdmin: false
          };
          setUser(loggedUser);
          localStorage.setItem('user', JSON.stringify(loggedUser));
          return true;
        }
      }
      
      // Si llegamos aquí, no se encontró el usuario
      console.log("No se encontró el usuario");
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
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Inicializar la lista de usuarios si no existe
      const storedUsersList = localStorage.getItem('usersList');
      let usersList = storedUsersList ? JSON.parse(storedUsersList) : [];
      
      // Comprobar si el email ya existe en la lista de usuarios
      const emailExists = usersList.some((u: any) => u.email === email);
      
      if (emailExists) {
        return false; // El email ya está registrado
      }
      
      // Crear nuevo usuario
      const newUser: User = {
        email,
        name,
        isAdmin: false
      };
      
      // Guardar el usuario en localStorage para la sesión actual
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      // Añadir a la lista de usuarios
      const newId = (usersList.length + 1).toString();
      const currentDate = new Date().toISOString().split('T')[0];
      
      usersList.push({
        id: newId,
        name,
        email,
        password,
        dateCreated: currentDate
      });
      
      localStorage.setItem('usersList', JSON.stringify(usersList));
      
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
