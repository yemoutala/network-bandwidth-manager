from flask import Blueprint, request, jsonify
from backend.auth.jwt_auth import authenticate, AuthManager, USER_DATABASE

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Route de connexion utilisateur"""
    data = request.get_json()
    
    # Validation des données
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({
            'status': 'error',
            'message': 'Identifiants requis'
        }), 400
    
    username = data['username']
    password = data['password']
    
    # Tentative d'authentification
    token = authenticate(username, password)
    
    if token:
        return jsonify({
            'status': 'success',
            'token': token,
            'user': {
                'username': username,
                'role': USER_DATABASE.get(username).role if username in USER_DATABASE else 'user'
            }
        }), 200
    else:
        return jsonify({
            'status': 'error',
            'message': 'Identifiants invalides'
        }), 401

@auth_bp.route('/profile', methods=['GET'])
@AuthManager.login_required
def get_profile():
    """Récupérer les informations du profil utilisateur"""
    # Le décorateur login_required garantit que seuls les utilisateurs authentifiés peuvent accéder
    token = request.headers.get('Authorization')
    username = AuthManager.verify_token(token)
    
    user = USER_DATABASE.get(username)
    
    if user:
        return jsonify({
            'status': 'success',
            'profile': {
                'username': user.username,
                'role': user.role
            }
        }), 200
    else:
        return jsonify({
            'status': 'error',
            'message': 'Utilisateur non trouvé'
        }), 404

@auth_bp.route('/change-password', methods=['POST'])
@AuthManager.login_required
def change_password():
    """Changer le mot de passe de l'utilisateur"""
    data = request.get_json()
    token = request.headers.get('Authorization')
    username = AuthManager.verify_token(token)
    
    # Validation des données
    if not data or 'current_password' not in data or 'new_password' not in data:
        return jsonify({
            'status': 'error',
            'message': 'Données de mot de passe incomplètes'
        }), 400
    
    user = USER_DATABASE.get(username)
    
    # Vérifier le mot de passe actuel
    if not user or not user.check_password(data['current_password']):
        return jsonify({
            'status': 'error',
            'message': 'Mot de passe actuel incorrect'
        }), 401
    
    # Mettre à jour le mot de passe
    user.password_hash = AuthManager.generate_password_hash(data['new_password'])
    
    return jsonify({
        'status': 'success',
        'message': 'Mot de passe modifié avec succès'
    }), 200
