import React, { useState, useEffect } from 'react';
import { LogService } from '../services/LogService';

function LogViewer() {
  const [logs, setLogs] = useState([]);
  const [logType, setLogType] = useState('system');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50
  });

  useEffect(() => {
    fetchLogs();
  }, [logType, pagination.page]);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      let logsData;
      switch(logType) {
        case 'network':
          logsData = await LogService.getNetworkLogs(pagination);
          break;
        case 'authentication':
          logsData = await LogService.getAuthenticationLogs(pagination);
          break;
        default:
          logsData = await LogService.getSystemLogs(pagination);
      }

      setLogs(logsData.logs);
    } catch (err) {
      setError('Impossible de charger les logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportLogs = async () => {
    try {
      await LogService.exportLogs(logType);
    } catch (err) {
      setError('Erreur lors de l\'exportation des logs');
    }
  };

  const renderLogTable = () => {
    // Colonnes variables selon le type de log
    const columns = {
      system: ['Timestamp', 'Niveau', 'Message'],
      network: ['Interface', 'Timestamp', 'Événement', 'Détails'],
      authentication: ['Utilisateur', 'Timestamp', 'Action', 'Statut']
    }[logType];

    return (
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {columns.map(column => (
              <th key={column} className="border p-2">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index} className="hover:bg-gray-100">
              {columns.map(column => (
                <td key={column} className="border p-2">
                  {log[column.toLowerCase().replace(' ', '_')] || 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Visualisation des Logs</h1>

      {/* Contrôles de filtrage */}
      <div className="mb-6 flex justify-between items-center">
        <div className="space-x-4">
          <select 
            value={logType}
            onChange={(e) => setLogType(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="system">Logs Système</option>
            <option value="network">Logs Réseau</option>
            <option value="authentication">Logs Authentification</option>
          </select>
        </div>

        <button 
          onClick={handleExportLogs}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Exporter les Logs
        </button>
      </div>

      {/* Gestion des erreurs et chargement */}
      {loading && <div>Chargement des logs...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Tableau de logs */}
      {!loading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          {renderLogTable()}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center space-x-4">
        <button 
          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          disabled={pagination.page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span>Page {pagination.page}</span>
        <button 
          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

export default LogViewer;
