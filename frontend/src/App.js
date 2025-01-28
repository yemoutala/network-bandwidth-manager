import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Composants d'authentification
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';

// Composants principaux
import Dashboard from './components/Dashboard';
import NetworkMonitoring from './components/NetworkMonitoring';
import IPBlocker from './components/IPBlocker';
import Profile from './components/Profile';

// Services
import { AuthService } from './services/AuthService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Barre de navigation */}
        {isAuthenticated && (
          <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">Network Manager</h1>
              <div>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </nav>
        )}

        {/* Routes */}
        <Routes>
          {/* Route de connexion */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Login onLogin={handleLogin} />
            } 
          />

          {/* Routes protégées */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/network-monitoring" 
            element={
              <PrivateRoute>
                <NetworkMonitoring />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/ip-blocker" 
            element={
              <PrivateRoute>
                <IPBlocker />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />

          {/* Redirection par défaut */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
