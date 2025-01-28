import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthService } from '../../../services/AuthService';

// Mock des dépendances
jest.mock('../../../services/AuthService');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('Composant Login', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    AuthService.login.mockClear();
    mockOnLogin.mockClear();
  });

  test('rendu du formulaire de connexion', () => {
    render(
      <MemoryRouter>
        <Login onLogin={mockOnLogin} />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Nom d\'utilisateur')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
  });

  test('soumettre le formulaire avec succès', async () => {
    // Mock de la connexion réussie
    AuthService.login.mockResolvedValue({
      token: 'fake_token',
      user: { username: 'testuser' }
    });

    render(
      <MemoryRouter>
        <Login onLogin={mockOnLogin} />
      </MemoryRouter>
    );

    // Remplir le formulaire
    fireEvent.change(screen.getByPlaceholderText('Nom d\'utilisateur'), { 
      target: { value: 'testuser' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { 
      target: { value: 'password123' } 
    });

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    // Vérifier les appels
    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockOnLogin).toHaveBeenCalled();
    });
  });

  test('afficher une erreur de connexion', async () => {
    // Mock de l'échec de connexion
    AuthService.login.mockRejectedValue(new Error('Identifiants incorrects'));

    render(
      <MemoryRouter>
        <Login onLogin={mockOnLogin} />
      </MemoryRouter>
    );

    // Remplir le formulaire
    fireEvent.change(screen.getByPlaceholderText('Nom d\'utilisateur'), { 
      target: { value: 'wronguser' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { 
      target: { value: 'wrongpassword' } 
    });

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    // Vérifier l'affichage de l'erreur
    await waitFor(() => {
      expect(screen.getByText(/Identifiants incorrects/i)).toBeInTheDocument();
    });
  });
});
