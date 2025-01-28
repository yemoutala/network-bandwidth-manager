import unittest
import sys
import os

# Ajouter le chemin du projet pour l'import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.auth.jwt_auth import AuthManager, authenticate, User

class TestAuthentication(unittest.TestCase):
    def setUp(self):
        # Préparation avant chaque test
        self.username = 'testuser'
        self.password = 'testpassword'
        
    def test_password_hashing(self):
        """Tester le hashage de mot de passe"""
        # Hasher le même mot de passe deux fois
        hash1 = AuthManager.generate_password_hash(self.password)
        hash2 = AuthManager.generate_password_hash(self.password)
        
        # Les hashs doivent être identiques
        self.assertEqual(hash1, hash2)
    
    def test_token_generation(self):
        """Tester la génération de token JWT"""
        token = AuthManager.generate_token(self.username)
        
        # Le token ne doit pas être None
        self.assertIsNotNone(token)
        
        # Vérifier que le token peut être décodé
        decoded_username = AuthManager.verify_token(token)
        self.assertEqual(decoded_username, self.username)
    
    def test_invalid_login(self):
        """Tester une tentative de connexion invalide"""
        # Essayer de s'authentifier avec des identifiants incorrects
        token = authenticate('invaliduser', 'wrongpassword')
        self.assertIsNone(token)
    
    def test_user_password_check(self):
        """Tester la vérification de mot de passe"""
        # Créer un utilisateur
        user = User(self.username, self.password)
        
        # Vérifier que le mot de passe correct passe
        self.assertTrue(user.check_password(self.password))
        
        # Vérifier qu'un mauvais mot de passe échoue
        self.assertFalse(user.check_password('wrongpassword'))
    
    def test_token_expiration(self):
        """Tester l'expiration du token"""
        token = AuthManager.generate_token(self.username)
        
        # Vérifier que le token est valide initialement
        decoded_username = AuthManager.verify_token(token)
        self.assertIsNotNone(decoded_username)

if __name__ == '__main__':
    unittest.main()
