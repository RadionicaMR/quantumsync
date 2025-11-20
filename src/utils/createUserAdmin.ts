import { supabase } from '@/integrations/supabase/client';

export async function createUserAsAdmin(email: string, password: string, fullName: string) {
  try {
    // Call the edge function to create user
    const { data, error } = await supabase.functions.invoke('admin-create-user', {
      body: {
        email,
        password,
        fullName
      }
    });

    if (error) throw error;
    if (data.error) throw new Error(data.error);

    return { success: true, data };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
}
