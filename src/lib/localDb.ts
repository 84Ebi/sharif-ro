// Local database for development testing
export interface User {
  id: string;
  username: string;
  password: string;
  name?: string;
  email?: string;
  phone?: string;
  studentCode?: string;
  credit?: number;
}

// In-memory database
const users: User[] = [
  {
    id: '1',
    username: 'ebi',
    password: '63487@Ky',
    name: 'Ebi',
    email: 'ebi@example.com',
    phone: '1234567890',
    studentCode: 'ST12345',
    credit: 100,
  }
];

export const localDb = {
  findUserByUsername: (username: string): User | undefined => {
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
  },
  
  verifyCredentials: (username: string, password: string): User | null => {
    const user = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    return user || null;
  },
  
  createUser: (userData: Omit<User, 'id'>): User => {
    const newUser = {
      id: (users.length + 1).toString(),
      ...userData
    };
    users.push(newUser);
    return newUser;
  },
  
  getUserById: (id: string): User | undefined => {
    return users.find(u => u.id === id);
  },
  
  getAllUsers: (): User[] => {
    return [...users];
  }
};

// Store user session in localStorage
export const authUtils = {
  setCurrentUser: (user: Omit<User, 'password'>) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  },
  
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userJson = localStorage.getItem('currentUser');
      if (userJson) {
        return JSON.parse(userJson);
      }
    }
    return null;
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  }
};