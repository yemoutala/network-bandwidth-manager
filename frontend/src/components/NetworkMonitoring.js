import React, { useState, useEffect } from 'react';
import { NetworkService } from '../services/NetworkService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function NetworkMonitoring() {
  const [networkStats, setNetworkStats] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [selectedInterface, setSelectedInterface] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const stats = await NetworkService.getNetworkStats();
        const networkAnomalies = await NetworkService.getNetworkAnomalies();
        
        setNetworkStats(stats);
        setAnomalies(networkAnomalies);
        
        // Sélectionner la première interface par défaut
        if (stats.length > 0) {
          setSelectedInterface(stats[0].interface);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Impossible de charger les données réseau');
        setLoading(false);
      }
    };

    fetchNetworkData();
    const intervalId = setInterval(fetchNetworkData, 30000); // Actualisation toutes les 30 secondes

    return () => clearInterval(intervalId);
  }, []);

  // Préparer les données pour le graphique de l'interface sélectionnée
  const getInterfaceChartData = () => {
    if (!selectedInterface) return null;

    const interfaceData = networkStats.find(stat => stat.interface === selectedInterface);
    
    if (!interfaceData) return null;

    return {
      labels: ['Upload', 'Download'],
      datasets: [
        {
          label: 'Bande passante (Ko/s)',
          data: [
            interfaceData.speed_upload / 1024, 
            interfaceData.speed_download / 1024
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ]
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Bande passante - ${selectedInterface || 'Interface'}`
      }
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Monitoring Réseau Détaillé</h1>

      {/* Sélection de l'interface */}
      <div className="mb-6">
        <label htmlFor="interface-select" className="block mb-2">Sélectionner une interface</label>
        <select
          id="interface-select"
          value={selectedInterface || ''}
          onChange={(e) => setSelectedInterface(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {networkStats.map(stat => (
            <option key={stat.interface} value={stat.interface}>
              {stat.interface}
            </option>
          ))}
        </select>
      </div>

      {/* Graphique de Bande Passante */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Bande Passante Détaillée</h2>
        {selectedInterface && (
          <Line 
            data={getInterfaceChartData()} 
            options={chartOptions} 
          />
        )}
      </div>

      {/* Détails de l'Interface */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Détails de l'Interface</h2>
        {selectedInterface && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Interface :</strong> {selectedInterface}
              <br />
              <strong>Octets envoyés :</strong> {networkStats.find(stat => stat.interface === selectedInterface).bytes_sent.toLocaleString()} octets
              <br />
              <strong>Octets reçus :</strong> {networkStats.find(stat => stat.interface === selectedInterface).bytes_recv.toLocaleString()} octets
            </div>
            <div>
              <strong>Vitesse Upload :</strong> {(networkStats.find(stat => stat.interface === selectedInterface).speed_upload / 1024).toFixed(2)} Ko/s
              <br />
              <strong>Vitesse Download :</strong> {(networkStats.find(stat => stat.interface === selectedInterface).speed_download / 1024).toFixed(2)} Ko/s
            </div>
          </div>
        )}
      </div>

      {/* Anomalies Réseau */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Anomalies Réseau</h2>
        {anomalies.length === 0 ? (
          <p className="text-green-600">Aucune anomalie détectée</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Interface</th>
                <th className="border p-2">Vitesse Upload (Ko/s)</th>
                <th className="border p-2">Vitesse Download (Ko/s)</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map((anomaly, index) => (
                <tr key={index} className="bg-red-100">
                  <td className="border p-2">{anomaly.interface}</td>
                  <td className="border p-2">
                    {(anomaly.upload_speed / 1024).toFixed(2)}
                  </td>
                  <td className="border p-2">
                    {(anomaly.download_speed / 1024).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default NetworkMonitoring;
