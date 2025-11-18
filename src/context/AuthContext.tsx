
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getAffiliateCookie } from '@/utils/affiliateTracking';
import { supabase } from '@/integrations/supabase/client';

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

// Ensure there's a backend session for the given email/password
const ensureBackendSession = async (email: string, password: string) => {
  try {
    const { data: { user: current } } = await supabase.auth.getUser();
    if (current?.email === email) {
      return; // already signed in with matching user
    }

    // Try sign in first
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (!signInError) return;

    // If sign in failed, try sign up with redirect (auto-confirm should be enabled)
    const redirectUrl = `${window.location.origin}/`;
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl }
    });

    if (signUpError) {
      console.warn('[AUTH] signUp error (may be user exists):', signUpError);
    }

    // Attempt sign in again after sign up (covers already registered users)
    await supabase.auth.signInWithPassword({ email, password });
  } catch (e) {
    console.error('[AUTH] Error ensuring backend session', e);
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  // Asegurar que todos los usuarios especiales existen al cargar la aplicación
  import('@/utils/userStorage').then(({ ensureSpecialUsersExist }) => {
    ensureSpecialUsersExist();
  });

  const restoreBackendSessionIfNeeded = async (email: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const sessionEmail = session?.user?.email;
      if (sessionEmail === email) return; // ya hay sesión válida

      // Determinar contraseña conocida para este usuario
      const specialPasswords: Record<string, string> = {
        'mauriramosgs@gmail.com': 'bere1603',
        'germancastroc25@gmail.com': 'german2025',
        'parapsicologodamiangomez@gmail.com': 'damian2025',
        'fuenzacari@gmail.com': 'carina2025',
        'jreyesreal@gmail.com': 'javier2025',
      };

      let password = specialPasswords[email.toLowerCase()];
      if (!password) {
        const storedUsersList = localStorage.getItem('usersList');
        if (storedUsersList) {
          try {
            const usersList = JSON.parse(storedUsersList);
            const found = usersList.find((u: any) => (u.email || '').trim().toLowerCase() === email.trim().toLowerCase());
            if (found?.password) password = (found.password as string).trim();
          } catch (e) {
            console.warn('[AUTH] No se pudo parsear usersList:', e);
          }
        }
      }

      if (password) {
        await ensureBackendSession(email, password);
      } else {
        console.warn('[AUTH] No se encontró contraseña para restaurar sesión backend');
      }
    } catch (e) {
      console.error('[AUTH] Error restaurando sesión backend:', e);
    }
  };

  // Verificar si hay un usuario en localStorage al cargar la aplicación
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Intentar restaurar la sesión del backend si falta
      if (parsedUser?.email) restoreBackendSessionIfNeeded(parsedUser.email);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user');
    }
  }

  // Mantener sincronizado el estado de backend (solo logging informativo)
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, _session) => {
    // Podemos añadir lógica si se requiere reaccionar a cambios
    // console.log('[AUTH] onAuthStateChange:', _event, _session?.user?.email);
  });

  setLoading(false);
  return () => {
    subscription.unsubscribe();
  };
}, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Limpiar espacios en blanco al inicio y final (problema común en Safari)
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
      
      console.log(`[LOGIN] === INICIANDO PROCESO DE LOGIN ===`);
      console.log(`[LOGIN] Email recibido: "${email}" -> limpiado: "${cleanEmail}"`);
      console.log(`[LOGIN] Password recibido: "${password}" -> limpiado: "${cleanPassword}"`);
      console.log(`[LOGIN] Verificando credenciales...`);
      
      // Comprobar si es el administrador
      console.log(`[LOGIN] Verificando admin...`);
      if (cleanEmail === 'mauriramosgs@gmail.com' && cleanPassword === 'bere1603') {
        const adminUser: User = {
          email,
          name: 'Mauricio Ramos',
          isAdmin: true
        };
        await ensureBackendSession(cleanEmail, cleanPassword);
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        console.log(`[LOGIN] Admin login exitoso`);
        return true;
      }
      
      // Acceso para usuarios especiales
      console.log(`[LOGIN] Verificando German...`);
      if (cleanEmail === 'germancastroc25@gmail.com' && cleanPassword === 'german2025') {
        const specialUser: User = {
          email: cleanEmail,
          name: 'German Castro',
          isAdmin: false
        };
        await ensureBackendSession(cleanEmail, cleanPassword);
        setUser(specialUser);
        localStorage.setItem('user', JSON.stringify(specialUser));
        console.log(`[LOGIN] Usuario especial German login exitoso`);
        return true;
      }
      
      // Nuevo acceso especial para Damian Gomez
      console.log(`[LOGIN] Verificando Damian...`);
      if (cleanEmail === 'parapsicologodamiangomez@gmail.com' && cleanPassword === 'damian2025') {
        const damianUser: User = {
          email: cleanEmail,
          name: 'Damian Gomez',
          isAdmin: false
        };
        await ensureBackendSession(cleanEmail, cleanPassword);
        setUser(damianUser);
        localStorage.setItem('user', JSON.stringify(damianUser));
        console.log(`[LOGIN] Usuario especial Damian login exitoso`);
        return true;
      }
      
      // Nuevo acceso especial para Carina Fuenza
      console.log(`[LOGIN] Verificando Carina...`);
      if (cleanEmail === 'fuenzacari@gmail.com' && cleanPassword === 'carina2025') {
        const carinaUser: User = {
          email: cleanEmail,
          name: 'Carina Fuenza',
          isAdmin: false
        };
        await ensureBackendSession(cleanEmail, cleanPassword);
        setUser(carinaUser);
        localStorage.setItem('user', JSON.stringify(carinaUser));
        console.log(`[LOGIN] Usuario especial Carina login exitoso`);
        return true;
      }
      
      // Nuevo acceso especial para Javier King
      console.log(`[LOGIN] Verificando Javier con email: "${email}" -> limpiado: "${cleanEmail}" password: "${password}" -> limpiado: "${cleanPassword}"`);
      console.log(`[LOGIN] Comparando: cleanEmail === 'jreyesreal@gmail.com' -> ${cleanEmail === 'jreyesreal@gmail.com'}`);
      console.log(`[LOGIN] Comparando: cleanPassword === 'javier2025' -> ${cleanPassword === 'javier2025'}`);
      if (cleanEmail === 'jreyesreal@gmail.com' && cleanPassword === 'javier2025') {
        console.log(`[LOGIN] ✅ CREDENCIALES DE JAVIER COINCIDEN!`);
        const javierUser: User = {
          email: cleanEmail,
          name: 'Javier King',
          isAdmin: false
        };
        await ensureBackendSession(cleanEmail, cleanPassword);
        setUser(javierUser);
        localStorage.setItem('user', JSON.stringify(javierUser));
        console.log(`[LOGIN] Usuario especial Javier login exitoso`);
        return true;
      } else {
        console.log(`[LOGIN] ❌ Credenciales de Javier NO coinciden`);
      }
      
      // Nuevo acceso especial para Cristina Terapia Integral
      console.log(`[LOGIN] Verificando Cristina...`);
      if (cleanEmail === 'cristina.terapiaintegral@gmail.com' && cleanPassword === 'cristina2025') {
        const cristinaUser: User = {
          email: cleanEmail,
          name: 'Cristina Terapia Integral',
          isAdmin: false
        };
        await ensureBackendSession(cleanEmail, cleanPassword);
        setUser(cristinaUser);
        localStorage.setItem('user', JSON.stringify(cristinaUser));
        console.log(`[LOGIN] Usuario especial Cristina login exitoso`);
        return true;
      }
      
      // Verificar si el usuario existe en la lista de usuarios general
      const storedUsersList = localStorage.getItem('usersList');
      console.log(`[LOGIN] Contenido de usersList en localStorage:`, storedUsersList);
      
      if (storedUsersList) {
        const usersList = JSON.parse(storedUsersList);
        console.log(`[LOGIN] Lista de usuarios parseada:`, usersList);
        console.log(`[LOGIN] Buscando usuario con email: ${cleanEmail} y password: ${cleanPassword}`);
        
        // Comparación sin distinguir mayúsculas y minúsculas para el email
        const foundUser = usersList.find((u: any) => {
          const userEmailClean = u.email.trim().toLowerCase();
          const userPasswordClean = u.password.trim();
          console.log(`[LOGIN] Comparando: "${userEmailClean}" === "${cleanEmail}" && "${userPasswordClean}" === "${cleanPassword}"`);
          console.log(`[LOGIN] Email match: ${userEmailClean === cleanEmail}, Password match: ${userPasswordClean === cleanPassword}`);
          return userEmailClean === cleanEmail && userPasswordClean === cleanPassword;
        });
        
        console.log(`[LOGIN] Usuario encontrado en la búsqueda:`, foundUser);
        
        if (foundUser) {
          const loggedUser: User = {
            email: foundUser.email,
            name: foundUser.name,
            isAdmin: false
          };
          await ensureBackendSession(cleanEmail, cleanPassword);
          setUser(loggedUser);
          localStorage.setItem('user', JSON.stringify(loggedUser));
          console.log(`[LOGIN] Login exitoso para usuario registrado:`, loggedUser);
          return true;
        }
      } else {
        console.log(`[LOGIN] No hay usersList en localStorage`);
      }
      
      // Si llegamos aquí, no se encontró el usuario
      console.log(`[LOGIN] No se encontró el usuario con email: ${email}`);
      return false;
    } catch (error) {
      console.error('[LOGIN] Error during login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    try { supabase.auth.signOut(); } catch (e) { console.error('[LOGOUT] Error signing out from backend', e); }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log(`[REGISTRO] === INICIANDO REGISTRO ===`);
      console.log(`[REGISTRO] Datos recibidos: name="${name}", email="${email}", password="${password}"`);
      
      // Check for affiliate referral
      const affiliateRefCode = localStorage.getItem('referralCode');
      console.log(`[REGISTRO] Código de referido encontrado: ${affiliateRefCode}`);
      
      // Inicializar la lista de usuarios si no existe
      const storedUsersList = localStorage.getItem('usersList');
      console.log(`[REGISTRO] usersList actual en localStorage:`, storedUsersList);
      
      let usersList = storedUsersList ? JSON.parse(storedUsersList) : [];
      console.log(`[REGISTRO] Lista actual de usuarios parseada:`, usersList);
      
      // Comprobar si el email ya existe en la lista de usuarios
      const emailExists = usersList.some((u: any) => {
        const existingEmailClean = u.email.trim().toLowerCase();
        const newEmailClean = email.trim().toLowerCase();
        console.log(`[REGISTRO] Verificando si "${existingEmailClean}" === "${newEmailClean}"`);
        return existingEmailClean === newEmailClean;
      });
      
      if (emailExists) {
        console.log(`[REGISTRO] ❌ Email ya existe: ${email}`);
        return false; // El email ya está registrado
      }
      
      console.log(`[REGISTRO] ✅ Email disponible, continuando con el registro`);
      
      // Crear nuevo usuario
      const newUser: User = {
        email,
        name,
        isAdmin: false
      };
      
      // Añadir a la lista de usuarios
      const newId = (usersList.length + 1).toString();
      const currentDate = new Date().toISOString().split('T')[0];
      
      const newUserForStorage = {
        id: newId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        dateCreated: currentDate
      };
      
      console.log(`[REGISTRO] Nuevo usuario para almacenamiento:`, newUserForStorage);
      
      usersList.push(newUserForStorage);
      console.log(`[REGISTRO] Lista actualizada de usuarios:`, usersList);
      
      // Guardar la lista actualizada
      localStorage.setItem('usersList', JSON.stringify(usersList));
      console.log(`[REGISTRO] ✅ Lista guardada en localStorage`);
      
      // Verificar que se guardó correctamente
      const verifyStorage = localStorage.getItem('usersList');
      console.log(`[REGISTRO] Verificación - usersList después de guardar:`, verifyStorage);
      
      // If there's a referral code, track the sale
      if (affiliateRefCode) {
        try {
          // Get affiliate by code
          const { data: affiliate } = await supabase
            .from('affiliates')
            .select('*')
            .eq('affiliate_code', affiliateRefCode)
            .eq('status', 'active')
            .maybeSingle();

          if (affiliate) {
            // Create a sale record - assuming a default product
            const { data: defaultProduct } = await supabase
              .from('products')
              .select('*')
              .eq('active', true)
              .limit(1)
              .maybeSingle();

            if (defaultProduct) {
              const commissionAmount = (defaultProduct.price_usd || 0) * (affiliate.commission_rate / 100);
              
              await supabase.from('affiliate_sales').insert({
                affiliate_id: affiliate.id,
                product_id: defaultProduct.id,
                customer_email: email,
                customer_name: name,
                sale_amount: defaultProduct.price_usd || 0,
                currency: 'USD',
                commission_amount: commissionAmount,
                commission_status: 'pending',
                payment_method: 'paypal'
              });

              // Update affiliate totals
              await supabase
                .from('affiliates')
                .update({
                  total_sales: affiliate.total_sales + 1,
                  total_commissions: affiliate.total_commissions + commissionAmount,
                  pending_commissions: affiliate.pending_commissions + commissionAmount
                })
                .eq('id', affiliate.id);

              console.log(`[REGISTRO] Sale tracked for affiliate: ${affiliateRefCode}`);
            }
          }
        } catch (error) {
          console.error('[REGISTRO] Error tracking affiliate sale:', error);
        }
      }
      
      // Iniciar sesión automáticamente con el nuevo usuario
      await ensureBackendSession(email.trim().toLowerCase(), password.trim());
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      console.log(`[REGISTRO] ✅ Usuario registrado con éxito y sesión iniciada:`, newUser);
      console.log(`[REGISTRO] === REGISTRO COMPLETADO ===`);
      return true;
    } catch (error) {
      console.error('[REGISTRO] ❌ Error during registration:', error);
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
    // En lugar de lanzar error inmediatamente, devolvemos valores por defecto
    console.warn('useAuth is being used outside of AuthProvider, returning default values');
    return {
      user: null,
      loading: false,
      login: async () => false,
      logout: () => {},
      register: async () => false,
      isAuthenticated: false
    };
  }
  return context;
};
