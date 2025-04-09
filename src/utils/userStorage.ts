
import { AdminUser } from "@/types/admin";

// Load users from localStorage
export const loadUsers = (): AdminUser[] => {
  const storedUsersList = localStorage.getItem('usersList');
  // Check for users registered through the AuthContext
  const authRegisteredUsers = localStorage.getItem('registeredUsers');
  
  let usersList: AdminUser[] = [];
  
  // Load users from the main usersList
  if (storedUsersList) {
    try {
      const parsedUsers = JSON.parse(storedUsersList);
      
      // Verify that the data is valid and has the expected structure
      if (Array.isArray(parsedUsers)) {
        usersList = parsedUsers.map((user, index) => {
          // If the user doesn't have an ID, assign one
          if (!user.id) {
            user.id = `main-${index + 1}`;
          }
          
          // If the user doesn't have a creation date, assign the current date
          if (!user.dateCreated) {
            user.dateCreated = new Date().toISOString().split('T')[0];
          }
          
          return user;
        });
      } else {
        console.error('The stored users format is invalid (not an array).');
      }
    } catch (error) {
      console.error('Error parsing users from localStorage:', error);
    }
  }
  
  // Also load users from the auth registration system
  if (authRegisteredUsers) {
    try {
      const parsedAuthUsers = JSON.parse(authRegisteredUsers);
      
      if (Array.isArray(parsedAuthUsers)) {
        // Convert auth users to admin users format and add to the list
        const formattedAuthUsers = parsedAuthUsers.map((user, index) => {
          // Generate a unique ID for auth-registered users
          const authUserId = `auth-${index + 1}`;
          
          // Check if this user is already in the main usersList (by email)
          const alreadyExists = usersList.some(existingUser => 
            existingUser.email.toLowerCase() === user.email.toLowerCase()
          );
          
          // Only add if not already in main list
          if (!alreadyExists) {
            return {
              id: authUserId,
              name: user.name || 'Usuario Registrado',
              email: user.email,
              password: user.password || 'password-protected',
              dateCreated: user.dateCreated || new Date().toISOString().split('T')[0]
            };
          }
          return null;
        }).filter(Boolean) as AdminUser[];
        
        // Add unique auth users to the main list
        usersList = [...usersList, ...formattedAuthUsers];
      }
    } catch (error) {
      console.error('Error parsing auth registered users:', error);
    }
  }
  
  // If no users are found in either source, initialize with default users
  if (usersList.length === 0) {
    usersList = initializeDefaultUsers();
  } else {
    // Save the consolidated list back to localStorage
    saveUsers(usersList);
  }
  
  // For debugging
  console.log('Loaded users:', usersList);
  
  return usersList;
};

// Initialize with default users
export const initializeDefaultUsers = (): AdminUser[] => {
  const defaultUsers: AdminUser[] = [
    {
      id: '1',
      name: 'Cliente Demo',
      email: 'cliente@example.com',
      password: 'password123', // In real production, this would be hashed
      dateCreated: '2023-04-01'
    },
    {
      id: '2',
      name: 'Ana García',
      email: 'ana@example.com',
      password: 'ana12345',
      dateCreated: '2023-05-15'
    }
  ];
  localStorage.setItem('usersList', JSON.stringify(defaultUsers));
  return defaultUsers;
};

// Save users to localStorage
export const saveUsers = (updatedUsers: AdminUser[]): void => {
  localStorage.setItem('usersList', JSON.stringify(updatedUsers));
};

// Add a new user
export const addUser = (users: AdminUser[], newUser: { name: string; email: string; password: string }): AdminUser[] => {
  // Determine the next available ID
  const maxId = users.length > 0 
    ? Math.max(...users.map(user => {
        // Extract numeric part from ID if it's a number
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
    password: newUser.password,
    dateCreated: currentDate
  };
  
  const updatedUsers = [...users, addedUser];
  saveUsers(updatedUsers);
  return updatedUsers;
};

// Delete a user
export const deleteUser = (users: AdminUser[], id: string): AdminUser[] => {
  const updatedUsers = users.filter(user => user.id !== id);
  saveUsers(updatedUsers);
  return updatedUsers;
};

// Update user password
export const updateUserPassword = (users: AdminUser[], userId: string, newPassword: string): AdminUser[] => {
  const updatedUsers = users.map(user => {
    if (user.id === userId) {
      return { ...user, password: newPassword };
    }
    return user;
  });
  saveUsers(updatedUsers);
  return updatedUsers;
};

// Synchronize users from all localStorage sources
export const synchronizeAllUsers = (): AdminUser[] => {
  return loadUsers(); // This already consolidates from multiple sources
};
