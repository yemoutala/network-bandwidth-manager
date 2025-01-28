import React, { useState, useEffect } from 'react';
import { NetworkService } from '../services/NetworkService';

function IPBlocker() {
  const [ipToBlock, setIpToBlock] = useState('');
  const [duration, setDuration] = useState(null);
  const [blockedIPs, setBlockedIPs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchBlockedIPs();
  }, []);

  const fetchBlockedIPs = async () => {
    try {
      const ips = await NetworkService.getBlockedIPs();
      setBlockedIPs(ips);
    } catch (err) {
      setError('Impossible de charger les IP bloquées');
    }
  };

  const handleBlockIP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Valider l'adresse IP
      const ipRegex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/;
      if (!ipRegex.test(ipToBlock)) {
        throw new Error('Adresse IP invalide');
      }

      const result = await NetworkService.blockIP(ipToBlock, duration);
      setSuccessMessage(`IP ${ipToBlock} bloquée avec succès`);
      
      // Réinitialiser le formulaire
      setIpToBlock('');
      setDuration(null);

      // Actualiser la liste des IP bloquées
      fetchBlockedIPs();
    } catch (err) {
      setError(err.message || 'Erreur lors du blocage de l\'IP');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockIP = async (ip) => {
    try {
      await NetworkService.unblockIP(ip);
      setSuccessMessage(`IP ${ip} débloquée avec succès`);
      fetchBlockedIPs();
    } catch (err) {
      setError('Impossible de débloquer l\'IP');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestionnaire de Blocage IP</h1>

      {/* Formulaire de Blocage IP */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Bloquer une IP</h2>
        <form onSubmit={handleBlockIP} className="space-y-4">
          <div>
            <label htmlFor="ip" className="block mb-2">Adresse IP</label>
            <input
              type="text"
              id="ip"
              value={ipToBlock}
              onChange={(e) => setIpToBlock(e.target.value)}
              placeholder="Ex: 192.168.1.100"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="duration" className="block mb-2">Durée de blocage (secondes, optionnel)</label>
            <input
              type="number"
              id="duration"
              value={duration || ''}
              onChange={(e) => setDuration(e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Durée en secondes"
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Blocage en cours...' : 'Bloquer IP'}
          </button>
        </form>

        {/* Gestion des messages */}
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}
      </div>

      {/* Liste des IP bloquées */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">IP Bloquées</h2>
        {blockedIPs.length === 0 ? (
          <p className="text-gray-600">Aucune IP bloquée</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Adresse IP</th>
                <th className="border p-2">Date de blocage</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blockedIPs.map((ip) => (
                <tr key={ip.ip} className="hover:bg-gray-100">
                  <td className="border p-2">{ip.ip}</td>
                  <td className="border p-2">
                    {new Date(ip.blocked_at).toLocaleString()}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleUnblockIP(ip.ip)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Débloquer
                    </button>
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

export default IPBlocker;
