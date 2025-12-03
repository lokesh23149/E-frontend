export const authService = {
  login: async (credentials) => {
    // Mock login - in a real app, this would call an API
    if (credentials.email === 'admin@gym.com' && credentials.password === 'password') {
      const user = { id: 1, email: credentials.email, name: 'Gym Admin' };
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(user));
      return { user, token: 'mock-token' };
    } else {
      throw new Error('Invalid credentials');
    }
  },

  register: async (userData) => {
    // Mock register - in a real app, this would call an API
    const user = { id: Date.now(), email: userData.email, name: userData.name };
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify(user));
    return { user, token: 'mock-token' };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },
};
