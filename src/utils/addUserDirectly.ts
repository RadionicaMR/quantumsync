import { supabase } from '@/integrations/supabase/client';

/**
 * Función administrativa para agregar usuarios directamente al sistema
 */
export const addUserDirectly = async (email: string, password: string, name: string) => {
  try {
    console.log(`[ADD USER] Agregando usuario: ${name} (${email})`);
    
    // 1. Crear usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: name.trim()
        }
      }
    });

    if (error) {
      console.error('[ADD USER] Error en Supabase Auth:', error);
      // Si el error es que el usuario ya existe, intentamos continuar
      if (!error.message.includes('already registered')) {
        throw error;
      }
    } else {
      console.log('[ADD USER] Usuario creado en Supabase Auth:', data.user?.id);
    }

    // 2. Agregar a localStorage para compatibilidad con el sistema actual
    const storedUsersList = localStorage.getItem('usersList');
    let usersList = storedUsersList ? JSON.parse(storedUsersList) : [];
    
    // Verificar si ya existe
    const emailExists = usersList.some((u: any) => 
      u.email.trim().toLowerCase() === email.trim().toLowerCase()
    );
    
    if (!emailExists) {
      const newId = (usersList.length + 1).toString();
      const currentDate = new Date().toISOString().split('T')[0];
      
      const newUserForStorage = {
        id: newId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        dateCreated: currentDate
      };
      
      usersList.push(newUserForStorage);
      localStorage.setItem('usersList', JSON.stringify(usersList));
      console.log('[ADD USER] Usuario agregado a localStorage');
    } else {
      console.log('[ADD USER] Usuario ya existe en localStorage');
    }

    return { success: true, message: 'Usuario agregado correctamente' };
  } catch (error) {
    console.error('[ADD USER] Error agregando usuario:', error);
    return { success: false, error };
  }
};
