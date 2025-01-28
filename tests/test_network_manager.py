import unittest
import sys
import os
import time

# Ajouter le chemin du projet pour l'import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.network_manager.ip_blocker import IPBlocker
from backend.network_manager.advanced_monitor import AdvancedNetworkMonitor

class TestNetworkManager(unittest.TestCase):
    def setUp(self):
        """Préparation avant chaque test"""
        self.ip_blocker = IPBlocker()
        self.network_monitor = AdvancedNetworkMonitor()
    
    def test_ip_blocking(self):
        """Tester le blocage et déblocage d'une adresse IP"""
        test_ip = '192.168.1.100'
        
        # Bloquer l'IP
        block_result = self.ip_blocker.block_ip(test_ip)
        self.assertTrue(block_result, "Le blocage de l'IP a échoué")
        
        # Vérifier que l'IP est dans la liste des IP bloquées
        blocked_ips = self.ip_blocker.list_blocked_ips()
        self.assertIn(test_ip, blocked_ips, "L'IP bloquée n'est pas dans la liste")
        
        # Débloquer l'IP
        unblock_result = self.ip_blocker.unblock_ip(test_ip)
        self.assertTrue(unblock_result, "Le déblocage de l'IP a échoué")
        
        # Vérifier que l'IP n'est plus dans la liste
        blocked_ips = self.ip_blocker.list_blocked_ips()
        self.assertNotIn(test_ip, blocked_ips, "L'IP n'a pas été débloquée correctement")
    
    def test_network_monitoring(self):
        """Tester le monitoring réseau"""
        # Démarrer le monitoring
        self.network_monitor.start_monitoring()
        
        # Attendre quelques secondes
        time.sleep(2)
        
        # Récupérer les statistiques
        stats = self.network_monitor.get_current_stats()
        
        # Arrêter le monitoring
        self.network_monitor.stop_monitoring()
        
        # Vérifications
        self.assertIsNotNone(stats, "Les statistiques réseau ne doivent pas être None")
        self.assertTrue(len(stats) > 0, "Il doit y avoir au moins une interface réseau")
    
    def test_network_anomaly_detection(self):
        """Tester la détection d'anomalies réseau"""
        # Démarrer le monitoring
        self.network_monitor.start_monitoring()
        
        # Attendre quelques secondes
        time.sleep(2)
        
        # Détecter les anomalies
        anomalies = self.network_monitor.detect_anomalies()
        
        # Arrêter le monitoring
        self.network_monitor.stop_monitoring()
        
        # Vérifications
        self.assertIsInstance(anomalies, list, "Les anomalies doivent être une liste")
    
    def test_ip_blocking_with_duration(self):
        """Tester le blocage d'IP avec une durée spécifique"""
        test_ip = '192.168.1.200'
        duration = 5  # 5 secondes
        
        # Bloquer l'IP pour une durée limitée
        block_result = self.ip_blocker.block_ip(test_ip, duration)
        self.assertTrue(block_result, "Le blocage de l'IP avec durée a échoué")
        
        # Vérifier que l'IP est bloquée
        blocked_ips = self.ip_blocker.list_blocked_ips()
        self.assertIn(test_ip, blocked_ips, "L'IP avec durée n'est pas bloquée")
        
        # Attendre que le temps de blocage expire
        time.sleep(6)
        
        # Vérifier que l'IP a été automatiquement débloquée
        blocked_ips = self.ip_blocker.list_blocked_ips()
        self.assertNotIn(test_ip, blocked_ips, "L'IP n'a pas été débloquée après expiration")

if __name__ == '__main__':
    unittest.main()
