
import { AdminUser } from "@/types/admin";

// Load users from localStorage
export const loadUsers = (): AdminUser[] => {
  const storedUsersList = localStorage.getItem('usersList');
  if (storedUsersList) {
    try {
      const parsedUsers = JSON.parse(storedUsersList);
      
      // Verify that the data is valid and has the expected structure
      if (Array.isArray(parsedUsers)) {
        // Ensure each user has the required fields
        const validUsers = parsedUsers.map((user, index) => {
          // If the user doesn't have an ID, assign one
          if (!user.id) {
            user.id = (index + 1).toString();
          }
          
          // If the user doesn't have a creation date, assign the current date
          if (!user.dateCreated) {
            user.dateCreated = new Date().toISOString().split('T')[0];
          }
          
          return user;
        });
        
        // Save the validated list
        localStorage.setItem('usersList', JSON.stringify(validUsers));
        return validUsers;
      } else {
        console.error('The stored users format is invalid (not an array).');
        return initializeDefaultUsers();
      }
    } catch (error) {
      console.error('Error parsing users from localStorage:', error);
      // If there's an error, initialize with default users
      return initializeDefaultUsers();
    }
  } else {
    // If no users are saved, initialize with default values
    return initializeDefaultUsers();
  }
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
    ? Math.max(...users.map(user => parseInt(user.id)))
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
