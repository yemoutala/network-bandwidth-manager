import os
import sys
import unittest

# Configuration du chemin pour les imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Configuration des tests
class TestConfig:
    # Configuration spécifique pour les tests
    TESTING = True
    SECRET_KEY = 'test_secret_key'
    DATABASE_URI = 'sqlite:///:memory:'  # Base de données en mémoire pour les tests

def setup_test_environment():
    """Préparer l'environnement de test"""
    # Configurer les variables d'environnement de test
    os.environ['TESTING'] = 'True'

def run_tests():
    """Exécuter tous les tests"""
    # Découvrir et exécuter les tests
    test_loader = unittest.TestLoader()
    test_suite = test_loader.discover('tests', pattern='test_*.py')
    
    # Créer un test runner
    test_runner = unittest.TextTestRunner(verbosity=2)
    
    # Exécuter les tests
    result = test_runner.run(test_suite)
    
    # Retourner le résultat des tests
    return result.wasSuccessful()

if __name__ == '__main__':
    setup_test_environment()
    tests_passed = run_tests()
    sys.exit(0 if tests_passed else 1)
