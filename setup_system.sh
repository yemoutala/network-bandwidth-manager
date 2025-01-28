#!/bin/bash

# Script d'installation et de configuration du Network Bandwidth Manager

# Vérification des permissions
if [[ $EUID -ne 0 ]]; then
   echo "Ce script doit être exécuté avec des privilèges root" 
   exit 1
fi

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Fonction de log
log() {
    echo -e "${GREEN}[INSTALLATION]${NC} $1"
}

error() {
    echo -e "${RED}[ERREUR]${NC} $1"
}

# Mise à jour du système
log "Mise à jour du système"
apt-get update && apt-get upgrade -y

# Installation des dépendances système
log "Installation des dépendances système"
apt-get install -y \
    python3 \
    python3-pip \
    postgresql \
    postgresql-contrib \
    iptables \
    net-tools \
    redis-server

# Configuration de Python
log "Configuration de l'environnement Python"
python3 -m venv /opt/network-manager-venv
source /opt/network-manager-venv/bin/activate

# Installation des dépendances Python
pip install -r requirements.txt

# Configuration de la base de données PostgreSQL
log "Configuration de la base de données PostgreSQL"
sudo -u postgres psql -c "CREATE DATABASE networkmanager;"
sudo -u postgres psql -c "CREATE USER networkadmin WITH PASSWORD 'motdepasse_securise';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE networkmanager TO networkadmin;"

# Configuration des règles iptables
log "Configuration des règles iptables de base"
iptables -F
iptables -X
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Permettre les connexions localhost
iptables -A INPUT -i lo -j ACCEPT

# Sauvegarder la configuration iptables
iptables-save > /etc/iptables/rules.v4

# Création des répertoires de log
log "Configuration des répertoires de log"
mkdir -p /var/log/network-manager
chown root:root /var/log/network-manager
chmod 755 /var/log/network-manager

# Configuration du service systemd
log "Création du service systemd"
cat > /etc/systemd/system/network-manager.service << EOL
[Unit]
Description=Network Bandwidth Management Service
After=network.target postgresql.service redis-server.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/network-manager
ExecStart=/opt/network-manager-venv/bin/python3 /opt/network-manager/backend/main.py
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOL

# Activer et démarrer le service
systemctl daemon-reload
systemctl enable network-manager
systemctl start network-manager

log "Installation terminée avec succès !"

# Message final
echo ""
echo "--------------------------------------------------------"
echo "Network Bandwidth Manager est maintenant installé"
echo "Accès : http://localhost:5000"
echo "Identifiant par défaut : admin"
echo "Mot de passe par défaut : admin_password"
echo "--------------------------------------------------------"

exit 0
