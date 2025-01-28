import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/AuthService';

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    // Charger le profil utilisateur
    const user = AuthService.getCurrentUser();
    setUserProfile(user);
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Validation des champs
    if (newPassword !== confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères');
      setLoading(false);
      return;
    }

    try {
      await AuthService.changePassword(currentPassword, newPassword);
      
      // Réinitialiser les champs
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Afficher un message de succès
      setSuccessMessage('Mot de passe modifié avec succès');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la modification du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) {
    return <div>Chargement du profil...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Mon Profil</h1>

        {/* Informations Utilisateur */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Informations Personnelles</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Nom d'utilisateur :</strong> {userProfile.username}</p>
            <p><strong>Rôle :</strong> {userProfile.role || 'Utilisateur'}</p>
          </div>
        </div>

        {/* Formulaire de Changement de Mot de Passe */}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Changer le Mot de Passe</h2>

          <div>
            <label htmlFor="currentPassword" className="block mb-2">Mot de passe actuel</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block mb-2">Nouveau mot de passe</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
              minLength="8"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              minLength="8"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Modification en cours...' : 'Changer le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
