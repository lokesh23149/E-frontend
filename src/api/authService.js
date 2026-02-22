import api from './axios';

export const authService = {
  login: async (credentials) => {
    try {
      // Backend expects username and password; frontend uses email as username
      const loginData = {
        username: credentials.email || credentials.username,
        password: credentials.password
      };

      const response = await api.post('/auth/login', loginData);
      const { token, user } = response.data;

      if (!token) {
        throw new Error('No token received');
      }

      const userData = user || { email: loginData.username, username: loginData.username };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      return { user: userData, token };
    } catch (error) {
      console.error('Login error:', error);
      const err = new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Login failed');
      err.response = error.response;
      throw err;
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
      // Backend accepts firstName, lastName, email, phone, address, city, state, zipCode
      const response = await api.put('/auth/profile', profileData);
      // Update local storage user data with response
      const updatedUser = response.data?.user || { ...authService.getCurrentUser(), ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      const msg = error.response?.data?.error || error.response?.data?.message || 'Failed to update profile';
      throw new Error(typeof msg === 'string' ? msg : 'Failed to update profile');
    }
  },

  getToken: () => {
    return localStorage.getItem('token');
  },
};
