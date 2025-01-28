# Network Bandwidth Manager

## Description
Une application complète de gestion et de monitoring de bande passante réseau avec des fonctionnalités avancées de sécurité et de contrôle.

## Fonctionnalités Principales
- 🔐 Authentification sécurisée
- 📊 Monitoring de bande passante en temps réel
- 🚫 Blocage/Déblocage d'adresses IP
- 📈 Détection d'anomalies réseau
- 📝 Système de logs complet

## Prérequis
- Python 3.9+
- Linux (recommandé)
- Docker (optionnel)

## Installation

### Installation Manuelle
```bash
# Cloner le dépôt
git clone https://github.com/votre_username/network-bandwidth-manager.git
cd network-bandwidth-manager

# Créer un environnement virtuel
python3 -m venv venv
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer la base de données
python setup_database.py

# Lancer l'application
python backend/main.py
```

### Installation Docker
```bash
# Construire et lancer l'application
docker-compose up --build
```

## Configuration

### Variables d'Environnement
- `SECRET_KEY`: Clé secrète pour les tokens JWT
- `DATABASE_URL`: URL de connexion à la base de données
- `NETWORK_INTERFACE`: Interface réseau à monitorer

## Tests
```bash
# Lancer les tests backend
python -m unittest discover backend/tests

# Lancer les tests frontend
cd frontend
npm test
```

## Sécurité
- Authentification JWT
- Chiffrement des mots de passe
- Protection contre les injections
- Contrôle d'accès granulaire

## Technologies Utilisées
- Backend : Python, Flask
- Frontend : React
- Base de données : PostgreSQL
- Authentification : JWT
- Monitoring : psutil

## Contribution
1. Fork du projet
2. Créer une branche de feature (`git checkout -b feature/AmazingFeature`)
3. Commit des modifications (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence
Distribué sous la licence MIT.
