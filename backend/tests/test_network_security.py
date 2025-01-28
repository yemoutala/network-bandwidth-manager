import unittest
import sys
import os
import ipaddress

# Ajouter le chemin du projet
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from network_manager.ip_blocker import IPBlocker
from network_manager.advanced_monitor import AdvancedNetworkMonitor

class TestNetworkSecurity(unittest.TestCase):
    def setUp(self):
        self.ip_blocker = IPBlocker()
        self.network_monitor = AdvancedNetworkMonitor()

    def test_valid_ip_blocking(self):
        """Tester le blocage d'une IP valide"""
        test_ip = '192.168.1.100'
        result = self.ip_blocker.block_ip(test_ip)
        self.assertTrue(result, "Le blocage de l'IP a échoué")

    def test_invalid_ip_blocking(self):
        """Tester le blocage d'une IP invalide"""
        invalid_ips = ['256.0.0.1', '192.168.1.256', 'invalid_ip']
        
        for ip in invalid_ips:
            with self.assertRaises(ValueError, msg=f"L'IP {ip} aurait dû lever une exception"):
                self.ip_blocker.block_ip(ip)

    def test_ip_blocking_with_duration(self):
        """Tester le blocage temporaire d'une IP"""
        test_ip = '192.168.1.200'
        duration = 5  # 5 secondes
        
        result = self.ip_blocker.block_ip(test_ip, duration)
        self.assertTrue(result, "Le blocage temporaire de l'IP a échoué")

        blocked_ips = self.ip_blocker.list_blocked_ips()
        self.assertIn(test_ip, blocked_ips, "L'IP bloquée n'est pas dans la liste")

    def test_anomaly_detection_thresholds(self):
        """Tester la détection d'anomalies avec différents seuils"""
        # Simuler un scénario d'anomalie
        test_data = [
            {'interface': 'test_interface', 'speed_upload': 1024 * 1024 * 2, 'speed_download': 1024 * 1024},  # Anomalie haute
            {'interface': 'test_interface', 'speed_upload': 100, 'speed_download': 200}  # Pas d'anomalie
        ]

        anomalies = self.network_monitor.detect_anomalies(
            test_data, 
            upload_threshold=1024 * 1024, 
            download_threshold=1024 * 1024
        )

        self.assertEqual(len(anomalies), 1, "La détection d'anomalies ne fonctionne pas correctement")
        self.assertEqual(anomalies[0]['interface'], 'test_interface', "Mauvaise interface détectée")

if __name__ == '__main__':
    unittest.main()
