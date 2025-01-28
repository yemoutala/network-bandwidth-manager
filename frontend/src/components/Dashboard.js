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

// Enregistrer les composants de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [networkStats, setNetworkStats] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const stats = await NetworkService.getNetworkStats();
        const networkAnomalies = await NetworkService.getNetworkAnomalies();
        
        setNetworkStats(stats);
        setAnomalies(networkAnomalies);
        setLoading(false);
      } catch (err) {
        setError('Impossible de charger les données réseau');
        setLoading(false);
      }
    };

    fetchNetworkData();
    const intervalId = setInterval(fetchNetworkData, 30000); // Actualisation toutes les 30 secondes

    // Nettoyer l'intervalle lors du démontage
    return () => clearInterval(intervalId);
  }, []);

  // Préparer les données pour le graphique
  const chartData = {
    labels: networkStats.map((stat, index) => `Interface ${index + 1}`),
    datasets: [
      {
        label: 'Bande passante Upload (Ko/s)',
        data: networkStats.map(stat => stat.speed_upload / 1024),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Bande passante Download (Ko/s)',
        data: networkStats.map(stat => stat.speed_download / 1024),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bande passante réseau'
      }
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord Réseau</h1>

      {/* Graphique de Bande Passante */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Bande Passante</h2>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Section Anomalies */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Anomalies Réseau</h2>
        {anomalies.length === 0 ? (
          <p className="text-green-600">Aucune anomalie détectée</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Interface</th>
                <th className="border p-2">Vitesse Upload</th>
                <th className="border p-2">Vitesse Download</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map((anomaly, index) => (
                <tr key={index} className="bg-red-100">
                  <td className="border p-2">{anomaly.interface}</td>
                  <td className="border p-2">
                    {(anomaly.upload_speed / 1024).toFixed(2)} Ko/s
                  </td>
                  <td className="border p-2">
                    {(anomaly.download_speed / 1024).toFixed(2)} Ko/s
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

export default Dashboard;
