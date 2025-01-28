#!/bin/bash

# Script de déploiement pour Network Bandwidth Manager

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Fonction de log
log() {
    echo -e "${GREEN}[DÉPLOIEMENT]${NC} $1"
}

error() {
    echo -e "${RED}[ERREUR]${NC} $1"
}

# Vérifier les prérequis
check_prerequisites() {
    log "Vérification des prérequis..."
    
    # Vérifier Docker
    if ! command -v docker &> /dev/null; then
        error "Docker n'est pas installé"
        exit 1
    fi

    # Vérifier Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose n'est pas installé"
        exit 1
    fi
}

# Étape de construction
build_application() {
    log "Construction des conteneurs..."
    docker-compose build
}

# Démarrage de l'application
start_application() {
    log "Démarrage de l'application..."
    docker-compose up -d
}

# Arrêt de l'application
stop_application() {
    log "Arrêt de l'application..."
    docker-compose down
}

# Mise à jour de l'application
update_application() {
    log "Mise à jour de l'application..."
    git pull origin main
    build_application
    start_application
}

# Nettoyage des ressources
cleanup() {
    log "Nettoyage des ressources Docker..."
    docker-compose down --rmi all --volumes
}

# Menu principal
main() {
    case "$1" in
        start)
            check_prerequisites
            start_application
            ;;
        stop)
            stop_application
            ;;
        restart)
            stop_application
            start_application
            ;;
        update)
            check_prerequisites
            update_application
            ;;
        build)
            check_prerequisites
            build_application
            ;;
        clean)
            cleanup
            ;;
        *)
            echo "Usage: $0 {start|stop|restart|update|build|clean}"
            exit 1
    esac
}

# Exécuter le script
main "$@"

exit 0
