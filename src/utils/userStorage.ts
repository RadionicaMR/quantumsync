import { AdminUser } from "@/types/admin";

// User storage utilities
// Note: This file previously contained hardcoded user credentials which have been removed
// for security reasons. All authentication now goes through Supabase Auth.

// Load users from localStorage (legacy support for admin panel display only)
export const loadUsers = (): AdminUser[] => {
  const storedUsersList = localStorage.getItem('usersList');
  
  if (storedUsersList) {
    try {
      const parsedUsers = JSON.parse(storedUsersList);
      if (Array.isArray(parsedUsers)) {
        return parsedUsers.map((user, index) => ({
          ...user,
          id: user.id || `user-${index + 1}`,
          dateCreated: user.dateCreated || new Date().toISOString().split('T')[0],
          password: '********' // Never expose passwords
        }));
      }
    } catch (error) {
      console.error('Error parsing users from localStorage:', error);
    }
  }
  
  return [];
};

// Save users to localStorage (admin panel only - does NOT affect authentication)
export const saveUsers = (updatedUsers: AdminUser[]): void => {
  console.warn('[USER_STORAGE] Saving to localStorage does not affect Supabase authentication');
  localStorage.setItem('usersList', JSON.stringify(updatedUsers));
};

// Add a new user (admin panel display only)
export const addUser = (users: AdminUser[], newUser: { name: string; email: string; password: string }): AdminUser[] => {
  const maxId = users.length > 0 
    ? Math.max(...users.map(user => {
        const idNum = parseInt(user.id.replace(/\D/g, ''));
        return isNaN(idNum) ? 0 : idNum;
      }))
    : 0;
  const newId = (maxId + 1).toString();
  const currentDate = new Date().toISOString().split('T')[0];
  
  const addedUser: AdminUser = {
    id: newId,
    name: newUser.name,
    email: newUser.email,
    password: '********', // Never store plaintext passwords
    dateCreated: currentDate
  };
  
  const updatedUsers = [...users, addedUser];
  saveUsers(updatedUsers);
  return updatedUsers;
};

// Delete a user (admin panel display only)
export const deleteUser = (users: AdminUser[], userId: string): AdminUser[] => {
  const updatedUsers = users.filter(user => user.id !== userId);
  saveUsers(updatedUsers);
  return updatedUsers;
};

// Initialize default users - NO-OP for security
export const initializeDefaultUsers = (): AdminUser[] => {
  console.log('[USER_STORAGE] Default users initialization disabled - use Supabase Auth to create users');
  return [];
};

// Ensure special users exist - NO-OP for security
export const ensureSpecialUsersExist = () => {
  console.log('[USER_STORAGE] All users now managed through Supabase Auth');
  // No-op: All user management happens through Supabase now
};
