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
      const { token, user } = response.data;

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

      await api.post('/api/users', registerData);

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

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      // Update local storage user data
      const currentUser = authService.getCurrentUser();
      const updatedUser = { ...currentUser, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  },

  getToken: () => {
    return localStorage.getItem('token');
  },
};
