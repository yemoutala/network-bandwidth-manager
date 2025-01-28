import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

export const AuthService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}login`, { username, password });
      
      if (response.data.token) {
        // Stocker le token et les informations utilisateur
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Erreur de connexion', error);
      throw error;
    }
  },

  logout: () => {
    // Supprimer les informations de l'utilisateur
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token; // Convertit en booléen
  },

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await axios.post(`${API_URL}change-password`, {
        current_password: currentPassword,
        new_password: newPassword
      }, {
        headers: {
          'Authorization': this.getToken()
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erreur de modification de mot de passe', error);
      throw error;
    }
  }
};
