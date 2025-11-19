import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  email: string;
  name: string;
  isAdmin: boolean;
  userId: string;
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

  const fetchUserRole = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('get_user_role', {
        _user_id: userId
      });
      
      if (error) {
        console.error('[AUTH] Error fetching user role:', error);
        return false;
      }
      
      return data === 'admin';
    } catch (error) {
      console.error('[AUTH] Exception fetching user role:', error);
      return false;
    }
  };

  const updateUserFromSession = async (supabaseUser: SupabaseUser) => {
    const isAdmin = await fetchUserRole(supabaseUser.id);
    
    const userData: User = {
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name || supabaseUser.email || '',
      isAdmin,
      userId: supabaseUser.id
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        updateUserFromSession(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Update state synchronously first
      if (session?.user) {
        // Defer Supabase calls with setTimeout to prevent deadlock
        setTimeout(() => {
          updateUserFromSession(session.user);
        }, 0);
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
      
      console.log('[LOGIN] Attempting Supabase authentication...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (error) {
        console.error('[LOGIN] Authentication failed:', error.message);
        return false;
      }

      if (!data.user) {
        console.error('[LOGIN] No user data returned');
        return false;
      }

      console.log('[LOGIN] Authentication successful');
      await updateUserFromSession(data.user);
      return true;
    } catch (error) {
      console.error('[LOGIN] Exception during login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('[LOGOUT] Error during logout:', error);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('[REGISTER] Starting registration process...');
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password.trim(),
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name.trim()
          }
        }
      });

      if (error) {
        console.error('[REGISTER] Registration failed:', error.message);
        return false;
      }

      if (!data.user) {
        console.error('[REGISTER] No user data returned');
        return false;
      }

      console.log('[REGISTER] Registration successful');
      
      // Check for affiliate referral
      const affiliateRefCode = localStorage.getItem('referralCode');
      if (affiliateRefCode) {
        try {
          const { data: affiliate } = await supabase
            .from('affiliates')
            .select('*')
            .eq('affiliate_code', affiliateRefCode)
            .eq('status', 'active')
            .maybeSingle();

          if (affiliate) {
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

              await supabase
                .from('affiliates')
                .update({
                  total_sales: affiliate.total_sales + 1,
                  total_commissions: affiliate.total_commissions + commissionAmount,
                  pending_commissions: affiliate.pending_commissions + commissionAmount
                })
                .eq('id', affiliate.id);

              console.log('[REGISTER] Affiliate sale tracked');
            }
          }
        } catch (error) {
          console.error('[REGISTER] Error tracking affiliate sale:', error);
        }
      }

      // Auto-login after registration
      if (data.session) {
        await updateUserFromSession(data.user);
      }
      
      return true;
    } catch (error) {
      console.error('[REGISTER] Exception during registration:', error);
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
