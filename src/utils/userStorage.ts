
import { AdminUser } from "@/types/admin";

// Load users from localStorage
export const loadUsers = (): AdminUser[] => {
  const storedUsersList = localStorage.getItem('usersList');
  
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
  
  // If no users are found, initialize with default users
  if (usersList.length === 0) {
    usersList = initializeDefaultUsers();
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
    },
    {
      id: '3',
      name: 'Damian Gomez',
      email: 'parapsicologodamiangomez@gmail.com',
      password: 'damian2025',
      dateCreated: '2025-04-21'
    },
    {
      id: '4',
      name: 'Carina Fuenza',
      email: 'fuenzacari@gmail.com',
      password: 'carina2025',
      dateCreated: '2025-05-21'
    },
    {
      id: '5',
      name: 'Karla Caballero Cedillo',
      email: 'kcaballerocedillo@gmail.com',
      password: 'karla2025',
      dateCreated: '2025-06-16'
    },
    {
      id: '6',
      name: 'Javier King',
      email: 'jreyesreal@gmail.com',
      password: 'javier2025',
      dateCreated: '2025-08-06'
    },
    {
      id: '7',
      name: 'Cristina Terapia Integral',
      email: 'cristina.terapiaintegral@gmail.com',
      password: 'cristina2025',
      dateCreated: '2025-09-04'
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

// Función específica para añadir el usuario Karla si no existe
export const ensureKarlaUserExists = (): void => {
  const usersList = loadUsers();
  
  // Verificar si Karla ya existe
  const karlaExists = usersList.some(user => 
    user.email.toLowerCase() === 'kcaballerocedillo@gmail.com'
  );
  
  if (!karlaExists) {
    console.log('[USER-STORAGE] Añadiendo usuario Karla Caballero Cedillo');
    addUser(usersList, {
      name: 'Karla Caballero Cedillo',
      email: 'kcaballerocedillo@gmail.com',
      password: 'karla2025'
    });
    console.log('[USER-STORAGE] Usuario Karla añadido exitosamente');
  } else {
    console.log('[USER-STORAGE] Usuario Karla ya existe');
  }
};

// Verifica si un usuario específico existe y crea el usuario Damian si no existe
export const ensureSpecialUsersExist = (): void => {
  const usersList = loadUsers();
  
  // Verificar si Damian Gomez ya existe
  const damianExists = usersList.some(user => 
    user.email.toLowerCase() === 'parapsicologodamiangomez@gmail.com'
  );
  
  // Verificar si Carina Fuenza ya existe
  const carinaExists = usersList.some(user => 
    user.email.toLowerCase() === 'fuenzacari@gmail.com'
  );
  
  // Verificar si Karla ya existe
  const karlaExists = usersList.some(user => 
    user.email.toLowerCase() === 'kcaballerocedillo@gmail.com'
  );
  
  // Verificar si Javier ya existe
  const javierExists = usersList.some(user => 
    user.email.toLowerCase() === 'jreyesreal@gmail.com'
  );
  
  // Verificar si Cristina ya existe
  const cristinaExists = usersList.some(user => 
    user.email.toLowerCase() === 'cristina.terapiaintegral@gmail.com'
  );
  
  if (!damianExists) {
    // Añadir a Damian Gomez si no existe
    addUser(usersList, {
      name: 'Damian Gomez',
      email: 'parapsicologodamiangomez@gmail.com',
      password: 'damian2025'
    });
    console.log('Usuario especial Damian Gomez añadido');
  }
  
  if (!carinaExists) {
    // Añadir a Carina Fuenza si no existe
    addUser(usersList, {
      name: 'Carina Fuenza',
      email: 'fuenzacari@gmail.com',
      password: 'carina2025'
    });
    console.log('Usuario especial Carina Fuenza añadido');
  }
  
  if (!karlaExists) {
    // Añadir a Karla si no existe
    addUser(usersList, {
      name: 'Karla Caballero Cedillo',
      email: 'kcaballerocedillo@gmail.com',
      password: 'karla2025'
    });
    console.log('Usuario especial Karla Caballero Cedillo añadido');
  }
  
  if (!javierExists) {
    // Añadir a Javier King si no existe
    addUser(usersList, {
      name: 'Javier King',
      email: 'jreyesreal@gmail.com',
      password: 'javier2025'
    });
    console.log('Usuario especial Javier King añadido');
  }
  
  if (!cristinaExists) {
    // Añadir a Cristina Terapia Integral si no existe
    addUser(usersList, {
      name: 'Cristina Terapia Integral',
      email: 'cristina.terapiaintegral@gmail.com',
      password: 'cristina2025'
    });
    console.log('Usuario especial Cristina Terapia Integral añadido');
  }
};

// Synchronize all users - corrección de la función que causaba el error
export const synchronizeAllUsers = (): AdminUser[] => {
  // Cargamos los usuarios actuales
  const currentUsers = loadUsers();
  
  // Nos aseguramos de que existan los usuarios especiales
  ensureSpecialUsersExist();
  
  // Cargamos nuevamente los usuarios después de asegurar que existan los especiales
  const updatedUsers = loadUsers();
  
  // Guardamos explícitamente la lista actualizada en localStorage para asegurar persistencia
  saveUsers(updatedUsers);
  
  console.log('Usuarios sincronizados. Total:', updatedUsers.length);
  
  return updatedUsers;
};

// Ejecutar esto para asegurarse de que los usuarios especiales existen
ensureSpecialUsersExist();
