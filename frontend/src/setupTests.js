// Configuration globale des tests
import '@testing-library/jest-dom/extend-expect';

// Configuration du localStorage pour les tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Simuler l'objet window
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Désactiver les warnings de console pendant les tests
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});
