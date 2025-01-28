import axios from 'axios';
import { AuthService } from './AuthService';

const API_URL = 'http://localhost:5000/api/logs/';

export const LogService = {
  async getSystemLogs(options = {}) {
    try {
      const response = await axios.get(API_URL, {
        headers: { 
          'Authorization': AuthService.getToken() 
        },
        params: {
          page: options.page || 1,
          limit: options.limit || 50,
          type: options.type || 'all'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des logs', error);
      throw error;
    }
  },

  async getNetworkLogs(options = {}) {
    try {
      const response = await axios.get(`${API_URL}network`, {
        headers: { 
          'Authorization': AuthService.getToken() 
        },
        params: {
          page: options.page || 1,
          limit: options.limit || 50,
          interface: options.interface
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des logs réseau', error);
      throw error;
    }
  },

  async getAuthenticationLogs(options = {}) {
    try {
      const response = await axios.get(`${API_URL}authentication`, {
        headers: { 
          'Authorization': AuthService.getToken() 
        },
        params: {
          page: options.page || 1,
          limit: options.limit || 50,
          user: options.user
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des logs d\'authentification', error);
      throw error;
    }
  },

  async exportLogs(logType) {
    try {
      const response = await axios.get(`${API_URL}export`, {
        headers: { 
          'Authorization': AuthService.getToken() 
        },
        params: { type: logType },
        responseType: 'blob'
      });

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${logType}_logs_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'exportation des logs', error);
      throw error;
    }
  }
};
