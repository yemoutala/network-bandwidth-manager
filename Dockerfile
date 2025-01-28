# Backend Dockerfile
FROM python:3.9-slim

# Métadonnées
LABEL maintainer="Votre Nom <votre.email@example.com>"
LABEL description="Network Bandwidth Manager"

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    net-tools \
    iptables \
    && rm -rf /var/lib/apt/lists/*

# Copier les fichiers de dépendances
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source
COPY backend/ ./backend
COPY setup_system.sh .

# Donner les permissions d'exécution au script
RUN chmod +x setup_system.sh

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV FLASK_ENV production

# Port exposé
EXPOSE 5000

# Commande de démarrage
CMD ["python", "-m", "backend.app"]
