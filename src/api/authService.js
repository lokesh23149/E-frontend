import api from './axios';

export const authService = {
  login: async (credentials) => {
    try {
      // Backend expects username and password, but frontend sends email and password
      // Assuming email is used as username for now
      const loginData = {
        username: credentials.email,
        password: credentials.password
      };

      const response = await api.post('/auth/login', loginData);
      const { token } = response.data;

      // For now, create a basic user object since backend doesn't return user details
      const user = { id: 1, email: credentials.email, name: 'User' };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  register: async (userData) => {
    try {
      const registerData = {
        name: userData.name,
        gmail: userData.email,
        username: userData.email, // Using email as username
        password: userData.password
      };

      const response = await api.post('/api/users', registerData);

      // After registration, automatically log in
      const loginResponse = await authService.login({
        email: userData.email,
        password: userData.password
      });

      return loginResponse;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
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
