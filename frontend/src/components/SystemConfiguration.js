import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthService } from '../services/AuthService';

function SystemConfiguration() {
  const [configuration, setConfiguration] = useState({
    network_interface: '',
    monitoring_interval: 30,
    bandwidth_threshold: 1024 * 1024, // 1 Mo/s
    log_retention_days: 30,
    anomaly_detection_enabled: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchSystemConfiguration();
  }, []);

  const fetchSystemConfiguration = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/system/config', {
        headers: { 'Authorization': AuthService.getToken() }
      });
      setConfiguration(response.data);
    } catch (err) {
      setError('Impossible de charger la configuration système');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigurationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfiguration(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'monitoring_interval' || name === 'bandwidth_threshold' || name === 'log_retention_days' 
              ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await axios.post('http://localhost:5000/api/system/config', configuration, {
        headers: { 
          'Authorization': AuthService.getToken(),
          'Content-Type': 'application/json'
        }
      });

      setSuccessMessage('Configuration système mise à jour avec succès');
    } catch (err) {
      setError('Erreur lors de la mise à jour de la configuration');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Configuration Système</h1>

      {loading && <div>Chargement de la configuration...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
        {/* Interface Réseau */}
        <div>
          <label htmlFor="network_interface" className="block mb-2">Interface Réseau</label>
          <input
            type="text"
            id="network_interface"
            name="network_interface"
            value={configuration.network_interface}
            onChange={handleConfigurationChange}
            className="w-full p-2 border rounded"
            placeholder="Ex: eth0, wlan0"
          />
        </div>

        {/* Intervalle de Monitoring */}
        <div>
          <label htmlFor="monitoring_interval" className="block mb-2">
            Intervalle de Monitoring (secondes)
          </label>
          <input
            type="number"
            id="monitoring_interval"
            name="monitoring_interval"
            value={configuration.monitoring_interval}
            onChange={handleConfigurationChange}
            min="5"
            max="300"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Seuil de Bande Passante */}
        <div>
          <label htmlFor="bandwidth_threshold" className="block mb-2">
            Seuil d'Anomalie Bande Passante (Ko/s)
          </label>
          <input
            type="number"
            id="bandwidth_threshold"
            name="bandwidth_threshold"
            value={configuration.bandwidth_threshold / 1024}
            onChange={(e) => {
              const value = parseInt(e.target.value) * 1024;
              setConfiguration(prev => ({ ...prev, bandwidth_threshold: value }));
            }}
            min="1"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Rétention des Logs */}
        <div>
          <label htmlFor="log_retention_days" className="block mb-2">
            Rétention des Logs (jours)
          </label>
          <input
            type="number"
            id="log_retention_days"
            name="log_retention_days"
            value={configuration.log_retention_days}
            onChange={handleConfigurationChange}
            min="1"
            max="365"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Détection d'Anomalies */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="anomaly_detection_enabled"
            name="anomaly_detection_enabled"
            checked={configuration.anomaly_detection_enabled}
            onChange={handleConfigurationChange}
            className="mr-2"
          />
          <label htmlFor="anomaly_detection_enabled">
            Activer la détection automatique d'anomalies
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer la Configuration'}
        </button>
      </form>
    </div>
  );
}

export default SystemConfiguration;
