from flask import Blueprint, request, jsonify
from backend.network_manager.advanced_monitor import AdvancedNetworkMonitor
from backend.network_manager.ip_blocker import IPBlocker
from backend.auth.jwt_auth import AuthManager

network_bp = Blueprint('network', __name__)
network_monitor = AdvancedNetworkMonitor()
ip_blocker = IPBlocker()

@network_bp.route('/network/stats', methods=['GET'])
@AuthManager.login_required
def get_network_stats():
    """Récupérer les statistiques réseau actuelles"""
    try:
        stats = network_monitor.get_current_stats()
        return jsonify({
            'status': 'success',
            'network_stats': stats
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@network_bp.route('/network/anomalies', methods=['GET'])
@AuthManager.login_required
def detect_network_anomalies():
    """Détecter les anomalies réseau"""
    try:
        anomalies = network_monitor.detect_anomalies()
        return jsonify({
            'status': 'success',
            'anomalies': anomalies
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@network_bp.route('/ip/block', methods=['POST'])
@AuthManager.login_required
def block_ip():
    """Bloquer une adresse IP"""
    data = request.json
    ip_address = data.get('ip_address')
    duration = data.get('duration')

    if not ip_address:
        return jsonify({
            'status': 'error',
            'message': 'Adresse IP requise'
        }), 400

    try:
        result = ip_blocker.block_ip(ip_address, duration)
        return jsonify({
            'status': 'success' if result else 'error',
            'message': 'IP bloquée avec succès' if result else 'Échec du blocage de l\'IP'
        }), 200 if result else 500
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@network_bp.route('/ip/unblock', methods=['POST'])
@AuthManager.login_required
def unblock_ip():
    """Débloquer une adresse IP"""
    data = request.json
    ip_address = data.get('ip_address')

    if not ip_address:
        return jsonify({
            'status': 'error',
            'message': 'Adresse IP requise'
        }), 400

    try:
        result = ip_blocker.unblock_ip(ip_address)
        return jsonify({
            'status': 'success' if result else 'error',
            'message': 'IP débloquée avec succès' if result else 'Échec du déblocage de l\'IP'
        }), 200 if result else 500
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@network_bp.route('/ip/blocked', methods=['GET'])
@AuthManager.login_required
def list_blocked_ips():
    """Lister les adresses IP bloquées"""
    try:
        blocked_ips = ip_blocker.list_blocked_ips()
        return jsonify({
            'status': 'success',
            'blocked_ips': blocked_ips
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
