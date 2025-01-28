import axios from 'axios';
import { AuthService } from '../AuthService';

// Mock axios
jest.mock('axios');

describe('AuthService', () => {
  beforeEach(() => {
    // Nettoyer le localStorage avant chaque test
    localStorage.clear();
  });

  test('login réussi', async () => {
    const mockResponse = {
      data: {
        token: 'fake_token',
        user: { username: 'testuser', role: 'admin' }
      }
    };
    
    axios.post.mockResolvedValue(mockResponse);

    const result = await AuthService.login('testuser', 'password');
    
    expect(localStorage.getItem('token')).toBe('fake_token');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({ username: 'testuser', role: 'admin' });
  });

  test('logout supprime les données', () => {
    // Simuler des données de connexion
    localStorage.setItem('token', 'fake_token');
    localStorage.setItem('user', JSON.stringify({ username: 'testuser' }));

    AuthService.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  test('getCurrentUser retourne les informations utilisateur', () => {
    const userInfo = { username: 'testuser', role: 'admin' };
    localStorage.setItem('user', JSON.stringify(userInfo));

    const result = AuthService.getCurrentUser();

    expect(result).toEqual(userInfo);
  });

  test('isAuthenticated retourne true/false correctement', () => {
    // Sans token
    expect(AuthService.isAuthenticated()).toBeFalsy();

    // Avec token
    localStorage.setItem('token', 'fake_token');
    expect(AuthService.isAuthenticated()).toBeTruthy();
  });
});
