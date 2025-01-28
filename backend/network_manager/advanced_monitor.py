import psutil
import time
import threading
import logging
from dataclasses import dataclass, asdict
from typing import Dict, List

@dataclass
class NetworkStats:
    interface: str
    bytes_sent: int
    bytes_recv: int
    packets_sent: int
    packets_recv: int
    speed_upload: float
    speed_download: float

class AdvancedNetworkMonitor:
    def __init__(self, interval=1, log_path='/var/log/network-manager/network_stats.log'):
        self.interval = interval
        self.is_monitoring = False
        self.monitoring_thread = None
        self.network_stats: Dict[str, NetworkStats] = {}
        self.previous_stats = {}
        
        # Configuration du logging
        logging.basicConfig(
            filename=log_path, 
            level=logging.INFO, 
            format='%(asctime)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)

    def _calculate_speed(self, current, previous, interval):
        """Calculer la vitesse en octets par seconde"""
        return (current - previous) / interval if interval > 0 else 0

    def _update_network_stats(self):
        """Mettre à jour les statistiques réseau"""
        current_stats = psutil.net_io_counters(pernic=True)
        
        for interface, stats in current_stats.items():
            # Ignorer les interfaces non significatives
            if interface.startswith(('lo', 'docker', 'veth', 'br')):
                continue

            # Calculer les vitesses
            if interface in self.previous_stats:
                prev = self.previous_stats[interface]
                upload_speed = self._calculate_speed(stats.bytes_sent, prev.bytes_sent, self.interval)
                download_speed = self._calculate_speed(stats.bytes_recv, prev.bytes_recv, self.interval)
            else:
                upload_speed = download_speed = 0

            # Créer les statistiques réseau
            network_stat = NetworkStats(
                interface=interface,
                bytes_sent=stats.bytes_sent,
                bytes_recv=stats.bytes_recv,
                packets_sent=stats.packets_sent,
                packets_recv=stats.packets_recv,
                speed_upload=upload_speed,
                speed_download=download_speed
            )

            # Stocker les statistiques
            self.network_stats[interface] = network_stat
            self.previous_stats[interface] = stats

            # Journalisation
            self._log_network_stats(network_stat)

    def _log_network_stats(self, network_stat):
        """Journaliser les statistiques réseau"""
        log_message = (
            f"Interface: {network_stat.interface}, "
            f"Upload: {network_stat.speed_upload/1024:.2f} Ko/s, "
            f"Download: {network_stat.speed_download/1024:.2f} Ko/s"
        )
        self.logger.info(log_message)

    def _monitoring_loop(self):
        """Boucle de monitoring principal"""
        while self.is_monitoring:
            self._update_network_stats()
            time.sleep(self.interval)

    def start_monitoring(self):
        """Démarrer le monitoring réseau"""
        if not self.is_monitoring:
            self.is_monitoring = True
            self.monitoring_thread = threading.Thread(target=self._monitoring_loop)
            self.monitoring_thread.start()
            print("Monitoring réseau démarré")

    def stop_monitoring(self):
        """Arrêter le monitoring réseau"""
        if self.is_monitoring:
            self.is_monitoring = False
            if self.monitoring_thread:
                self.monitoring_thread.join()
            print("Monitoring réseau arrêté")

    def get_current_stats(self) -> List[Dict]:
        """Récupérer les statistiques actuelles"""
        return [asdict(stats) for stats in self.network_stats.values()]

    def detect_anomalies(self, threshold_upload=1024*1024, threshold_download=1024*1024):
        """Détecter des anomalies de trafic"""
        anomalies = []
        for interface, stats in self.network_stats.items():
            if stats.speed_upload > threshold_upload or stats.speed_download > threshold_download:
                anomalies.append({
                    'interface': interface,
                    'upload_speed': stats.speed_upload,
                    'download_speed': stats.speed_download
                })
        return anomalies

# Exemple d'utilisation
if __name__ == "__main__":
    monitor = AdvancedNetworkMonitor()
    monitor.start_monitoring()
    
    try:
        while True:
            time.sleep(10)
            print("Statistiques actuelles :")
            for stats in monitor.get_current_stats():
                print(f"Interface {stats['interface']}: Upload {stats['speed_upload']/1024:.2f} Ko/s, Download {stats['speed_download']/1024:.2f} Ko/s")
            
            # Vérifier les anomalies
            anomalies = monitor.detect_anomalies()
            if anomalies:
                print("Anomalies détectées :", anomalies)
    
    except KeyboardInterrupt:
        monitor.stop_monitoring()
