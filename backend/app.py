from flask import Flask
from flask_cors import CORS
from backend.routes.network_routes import network_bp
from backend.routes.auth_routes import auth_bp
from backend.config import Config
import logging

def create_app(config_class=Config):
    """Créer et configurer l'application Flask"""
    app = Flask(__name__)
    
    # Configuration
    app.config.from_object(config_class)
    
    # CORS (Cross-Origin Resource Sharing)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Configuration du logging
    configure_logging(app)
    
    # Enregistrement des blueprints
    app.register_blueprint(network_bp, url_prefix='/api/network')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # Route de test de base
    @app.route('/api/health')
    def health_check():
        return {"status": "healthy"}, 200
    
    # Gestionnaire d'erreurs
    @app.errorhandler(Exception)
    def handle_exception(e):
        """Gestionnaire global des erreurs"""
        app.logger.error(f'Erreur non gérée : {str(e)}')
        return {
            'status': 'error',
            'message': 'Une erreur interne est survenue'
        }, 500
    
    return app

def configure_logging(app):
    """Configurer le système de logging"""
    # Supprimer les handlers existants
    del app.logger.handlers[:]
    
    # Configuration du logger
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),  # Console
            logging.FileHandler('/var/log/network-manager/app.log')  # Fichier de log
        ]
    )
    
    # Niveau de log pour les requêtes
    logging.getLogger('werkzeug').setLevel(logging.WARNING)

# Point d'entrée principal
if __name__ == '__main__':
    app = create_app()
    app.run(
        host='0.0.0.0', 
        port=5000, 
        debug=True
    )
