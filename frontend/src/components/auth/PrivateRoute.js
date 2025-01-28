import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../../services/AuthService';

function PrivateRoute({ children }) {
  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirection vers la page de login si non authentifié
    return <Navigate to="/login" replace />;
  }

  // Rendre le composant enfant si authentifié
  return children;
}

export default PrivateRoute;
