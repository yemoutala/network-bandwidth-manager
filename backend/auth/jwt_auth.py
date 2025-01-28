import jwt
import datetime
import hashlib
from functools import wraps
from flask import request, jsonify
from backend.config import Config

class AuthManager:
    @staticmethod
    def generate_password_hash(password):
        """Générer un hash sécurisé du mot de passe"""
        salt = "network_manager_salt"
        return hashlib.sha256((password + salt).encode()).hexdigest()

    @staticmethod
    def generate_token(user_id):
        """Générer un token JWT"""
        payload = {
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1),
            'iat': datetime.datetime.utcnow()
        }
        return jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')

    @staticmethod
    def verify_token(token):
        """Vérifier la validité du token"""
        try:
            payload = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
            return payload['user_id']
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

    @staticmethod
    def login_required(f):
        """Décorateur pour sécuriser les routes"""
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = request.headers.get('Authorization')
            if not token:
                return jsonify({'message': 'Token manquant'}), 401
            
            user_id = AuthManager.verify_token(token)
            if not user_id:
                return jsonify({'message': 'Token invalide'}), 401
            
            return f(*args, **kwargs)
        return decorated_function

class User:
    def __init__(self, username, password, role='user'):
        self.username = username
        self.password_hash = AuthManager.generate_password_hash(password)
        self.role = role

    def check_password(self, password):
        """Vérifier le mot de passe"""
        return self.password_hash == AuthManager.generate_password_hash(password)

# Simulation de base de données utilisateurs (à remplacer par une vraie BDD)
USER_DATABASE = {
    'admin': User('admin', 'admin_password', 'admin'),
    'user': User('user', 'user_password')
}

def authenticate(username, password):
    """Authentifier un utilisateur"""
    user = USER_DATABASE.get(username)
    if user and user.check_password(password):
        return AuthManager.generate_token(username)
    return None
