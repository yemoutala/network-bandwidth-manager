import axios from 'axios';
import { AuthService } from './AuthService';

const API_URL = 'http://localhost:5000/api/network/';

export const NetworkService = {
  async getNetworkStats() {
    try {
      const response = await axios.get(`${API_URL}stats`, {
        headers: { 
          'Authorization': AuthService.getToken() 
        }
      });
      return response.data.network_stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques réseau', error);
      throw error;
    }
  },

  async getNetworkAnomalies() {
    try {
      const response = await axios.get(`${API_URL}anomalies`, {
        headers: { 
          'Authorization': AuthService.getToken() 
        }
      });
      return response.data.anomalies;
    } catch (error) {
      console.error('Erreur lors de la récupération des anomalies réseau', error);
      throw error;
    }
  },

  async blockIP(ipAddress, duration = null) {
    try {
      const response = await axios.post(`${API_URL}ip/block`, 
        { ip_address: ipAddress, duration },
        {
          headers: { 
            'Authorization': AuthService.getToken() 
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors du blocage de l\'IP', error);
      throw error;
    }
  },

  async unblockIP(ipAddress) {
    try {
      const response = await axios.post(`${API_URL}ip/unblock`, 
        { ip_address: ipAddress },
        {
          headers: { 
            'Authorization': AuthService.getToken() 
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors du déblocage de l\'IP', error);
      throw error;
    }
  },

  async getBlockedIPs() {
    try {
      const response = await axios.get(`${API_URL}ip/blocked`, {
        headers: { 
          'Authorization': AuthService.getToken() 
        }
      });
      return response.data.blocked_ips;
    } catch (error) {
      console.error('Erreur lors de la récupération des IP bloquées', error);
      throw error;
    }
  }
};
