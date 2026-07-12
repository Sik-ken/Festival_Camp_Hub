# Rock 4C+ Setup-Anleitung

Schritt-für-Schritt-Anleitung, um den Rock 4C+ von "leer" bis "läuft im
Camp-Netz" zu bringen. In zwei Phasen:

- **Phase A (jetzt, zu Hause):** OS, Docker, Projekt, Test im Heimnetz.
- **Phase B (kurz vor/am Festival):** Umschalten auf das ESP32-Netz, DNS/Captive
  Portal aktivieren, Autostart einschalten.

> **Warum zwei Phasen?** Die DNS-Wildcard-Konfiguration (Schritt B2) leitet
> **alle** Domains auf den Rock um. Das ist im isolierten Camp-Netz gewollt,
> würde aber dein Heimnetz komplett lahmlegen (kein Internet mehr für
> irgendein Gerät). Deshalb: DNS/Captive Portal erst aktivieren, wenn der Rock
> wirklich im ESP32-Netz hängt.

---

## Phase A — Zu Hause vorbereiten

### A1. Was du brauchst
- Rock 4C+ mit Netzteil
- microSD-Karte (min. 16 GB) oder eMMC/USB-SSD zum Booten
- Die USB-SSD, die später für `/mnt/festival-data` genutzt wird (falls separat vom Boot-Medium)
- Ein Kabel/Adapter, um die SD-Karte an deinen Windows-PC anzuschließen
- Dein Windows-PC mit Netzwerkzugriff auf den Rock (gleiches Heim-WLAN/LAN)

### A2. OS-Image flashen
1. Lade das offizielle Radxa-Debian-Image für ROCK 4C+ herunter:
   https://wiki.radxa.com/Rock4/downloads (Debian/Ubuntu Server-Image, kein Desktop nötig).
2. Flashe es mit [balenaEtcher](https://etcher.balena.io/) auf die SD-Karte/eMMC.
3. SD-Karte in den Rock stecken, Netzteil anschließen, per Ethernet-Kabel mit deinem
   Heimrouter verbinden (fürs Ersteinrichten ist eine Kabelverbindung am einfachsten).

### A3. Erster Boot & SSH
1. Finde die IP-Adresse des Rock in deinem Heimnetz (z. B. über die Router-Oberfläche,
   Geräteliste, oder `arp -a` auf deinem PC nach dem Boot).
2. Verbinde dich per SSH (Standard-User bei Radxa-Images meist `rock`, Passwort `rock`):
   ```
   ssh rock@<ip-im-heimnetz>
   ```
3. Passwort sofort ändern:
   ```
   passwd
   ```
4. Hostname setzen:
   ```
   sudo hostnamectl set-hostname helmpflicht-hub
   ```
5. System aktualisieren:
   ```
   sudo apt update && sudo apt full-upgrade -y
   sudo reboot
   ```

✅ **Test:** Nach dem Reboot wieder per SSH verbinden können.

### A4. WLAN-Interface prüfen
Der Rock muss sich später per WLAN mit dem ESP32-AP verbinden. Prüfen, ob ein
WLAN-Interface vorhanden ist:
```
nmcli device status
```
- Siehst du ein Gerät vom Typ `wifi`? Dann ist alles gut (onboard-Modul oder
  bereits gestecktes USB-WLAN-Dongle).
- Kein `wifi`-Gerät? Dann brauchst du einen USB-WLAN-Adapter für den Rock —
  vor dem Festival besorgen und hier testen, bevor es weitergeht.

### A5. Docker installieren
```
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```
Neu einloggen (damit die Gruppenmitgliedschaft greift), dann testen:
```
docker run hello-world
```

### A6. USB-SSD einbinden
1. USB-SSD anschließen, Gerätenamen finden:
   ```
   lsblk
   ```
2. Falls die SSD noch kein Dateisystem hat, einmalig formatieren (⚠️ löscht alle
   Daten auf der SSD — Gerätename `sdX` durch den echten Namen aus `lsblk` ersetzen):
   ```
   sudo mkfs.ext4 /dev/sdX1
   ```
3. Mount-Punkt anlegen und UUID ermitteln:
   ```
   sudo mkdir -p /mnt/festival-data
   sudo blkid /dev/sdX1
   ```
4. Eintrag in `/etc/fstab` ergänzen (UUID aus Schritt 3 einsetzen), damit die SSD
   bei jedem Boot automatisch eingebunden wird:
   ```
   UUID=<deine-uuid>  /mnt/festival-data  ext4  defaults,nofail  0  2
   ```
5. Mounten und prüfen:
   ```
   sudo mount -a
   df -h /mnt/festival-data
   ```

✅ **Test:** `/mnt/festival-data` ist gemountet und beschreibbar (`touch /mnt/festival-data/test && rm /mnt/festival-data/test`).

### A7. Projekt auf den Rock übertragen
Von deinem Windows-PC aus (PowerShell), Projektordner auf den Rock kopieren:
```
scp -r "D:\Dokumente\Arduino\Helmpflicht HUB\helmpflicht-hub" rock@<ip-im-heimnetz>:/opt/
```
Falls `/opt` keine Schreibrechte hat, vorher auf dem Rock: `sudo mkdir -p /opt/helmpflicht-hub && sudo chown $USER /opt/helmpflicht-hub`.

Auf dem Rock die Datenverzeichnisse auf die SSD verlinken statt auf die
System-SD-Karte (spart Platz und Schreibzyklen auf der SD-Karte):
```
cd /opt/helmpflicht-hub
rm -rf data backups
ln -s /mnt/festival-data/uploads-root data   # siehe Hinweis unten
```
> Einfacher: leg unter `/mnt/festival-data/` gleich die Struktur `db/ uploads/
> thumbnails/ exports/` sowie `backups/` an und verlinke `data` bzw. `backups`
> jeweils dorthin, oder passe die Bind-Mount-Pfade in `docker-compose.yml`
> direkt auf `/mnt/festival-data/...` an. Beides funktioniert — Hauptsache
> die Pfade in `docker-compose.yml` zeigen am Ende auf die SSD.

### A8. Secrets setzen
```
cd /opt/helmpflicht-hub
cp .env.example .env
nano .env
```
- `HUB_JWT_SECRET`: `openssl rand -hex 32` ausführen und Ergebnis eintragen
- `HUB_ADMIN_BOOTSTRAP_PIN`: eigenen Admin-PIN festlegen (nicht `changeme123` lassen!)

### A9. Erststart im Heimnetz testen
```
cd /opt/helmpflicht-hub
docker compose up --build
```
Vom Windows-PC im Browser (gleiches Heimnetz) aufrufen: `http://<ip-im-heimnetz>/`

✅ **Test:** Startseite lädt, Registrierung funktioniert, `/api/health` liefert `{"status":"ok",...}`.

Mit `Strg+C` stoppen, dann im Hintergrund laufen lassen zum Weiterarbeiten:
```
docker compose up -d
```

### A10. Health-Check-Cron einrichten
Läuft unabhängig von Heim- oder Festival-Netz, kann also schon jetzt
eingerichtet werden. Prüft alle 5 Minuten ob die API antwortet und alle
Container laufen, startet den Stack bei Bedarf automatisch neu.

Hinweis: ein automatischer Netzwerk-Reset (`nmcli networking off/on`) bei
nicht erreichbarem Gateway wurde bewusst wieder entfernt - auf diesem Rock
(volle KDE-Desktopumgebung) hat der Toggle das gesamte System zum Hängen
gebracht statt es zu reparieren, siehe Kommentar in `healthcheck.sh`.
```
chmod +x network/healthcheck.sh
crontab -e
```
Inhalt von `network/healthcheck.cron` einfügen (Pfad in der Zeile ggf.
anpassen) und speichern.

✅ **Test:** `bash network/healthcheck.sh` einmal manuell ausführen, danach
`cat healthcheck.log` sollte eine Zeile mit `OK` zeigen.

### A11. Aktive Lüftersteuerung mit Mindestdrehzahl einrichten
Der Kernel-Governor `step_wise` (siehe oben, `thermal_zone0`) schaltet den
PWM-Lüfter bei niedriger Temperatur komplett ab und eskaliert nur in zwei
groben Stufen bis 100°C. `network/fan_control.sh` übernimmt die Regelung
stattdessen selbst: feinere Rampe, nie ganz aus (Mindestdrehzahl ~30%).
```
chmod +x network/fan_control.sh
sudo cp network/fan-control.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now fan-control.service
```

✅ **Test:** `systemctl status fan-control.service` sollte `active (running)`
zeigen, `cat /sys/class/hwmon/hwmon2/pwm1` sollte im Leerlauf ~77 (statt 0)
sein.

---

## Phase B — Umschalten aufs Festival-Netz

Diese Schritte erst durchführen, wenn der ESP32 läuft (SSID/Passwort bekannt)
und du bereit bist, den Rock vom Heimnetz zu trennen.

### B1. Statische WLAN-Verbindung zum ESP32 einrichten
Verbindung zur ESP32-SSID herstellen und dabei eine feste IP vergeben
(ersetze `<ESP32-SSID>` und `<ESP32-Passwort>`):
```
sudo nmcli connection add type wifi ifname wlan0 con-name helmpflicht-ap \
  ssid "<ESP32-SSID>" \
  wifi-sec.key-mgmt wpa-psk wifi-sec.psk "<ESP32-Passwort>" \
  ipv4.method manual ipv4.addresses 192.168.4.2/24 ipv4.gateway 192.168.4.1 \
  ipv4.dns 127.0.0.1 \
  connection.autoconnect yes
sudo nmcli connection up helmpflicht-ap
```
> Wichtig: 192.168.4.2 muss **außerhalb** des DHCP-Bereichs liegen, den
> `esp32_nat_router` vergibt, sonst gibt es IP-Konflikte. Im esp32_nat_router-
> Webinterface prüfen, dass der DHCP-Pool z. B. erst ab `192.168.4.10` beginnt.

✅ **Test:** `ping 192.168.4.1` (der ESP32) antwortet.

### B2. dnsmasq installieren und aktivieren
```
sudo apt install -y dnsmasq
sudo systemctl stop systemd-resolved   # falls aktiv, blockiert sonst Port 53
sudo systemctl disable systemd-resolved
sudo cp /opt/helmpflicht-hub/network/dnsmasq.conf /etc/dnsmasq.d/helmpflicht-hub.conf
```
In `/etc/dnsmasq.d/helmpflicht-hub.conf` die Zeile `interface=` einkommentieren
und den Namen deines WLAN-Interfaces eintragen (aus `nmcli device status`, meist `wlan0`).
```
sudo systemctl restart dnsmasq
sudo systemctl enable dnsmasq
```

✅ **Test (vom Rock aus):**
```
nslookup camp.local 127.0.0.1      # sollte 192.168.4.2 liefern
nslookup irgendeine-domain.de 127.0.0.1   # sollte ebenfalls 192.168.4.2 liefern (Wildcard)
```

### B3. Docker Compose + Autostart aktivieren
```
cd /opt/helmpflicht-hub
docker compose up -d
sudo cp network/helmpflicht-hub.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable helmpflicht-hub.service
```

### B4. Backup-Cron einrichten
```
crontab -e
```
Inhalt von `network/backup.cron` einfügen und speichern.

### B5. Der große Praxistest
1. Handy: WLAN-Einstellungen öffnen, mit der ESP32-SSID verbinden.
2. Erwartet: Betriebssystem zeigt automatisch "Am Netzwerk anmelden" /
   Captive-Portal-Popup, öffnet einen Mini-Browser mit der Helmpflicht-Hub-Startseite.
3. Falls kein automatisches Popup kommt: Browser manuell öffnen, egal welche
   URL eingeben (z. B. `example.com`) — die Wildcard-DNS sollte trotzdem auf
   den Hub umleiten.
4. Mit einem zweiten Handy (Android **und** iPhone testen, beide Systeme
   prüfen Captive Portals unterschiedlich) wiederholen.
5. QR-Code, der zu `http://camp.local` bzw. der ESP32-SSID/Passwort führt,
   erstellen und ebenfalls testen.

✅ **Test:** Beide Betriebssysteme (iOS + Android) öffnen automatisch das
Portal beim Verbinden. Mehrere Geräte gleichzeitig verbunden funktionieren
weiter stabil.

### B6. Neustart-Fähigkeit verifizieren
```
sudo reboot
```
Nach dem Neustart (ohne manuell etwas zu tun): Ist der Hub wieder per WLAN
erreichbar? `docker compose ps` sollte beide Container als "Up" zeigen.

---

## Troubleshooting-Kurzreferenz

| Problem | Vermutung | Check |
|---|---|---|
| Rock bekommt keine IP im ESP32-Netz | DHCP-Pool-Konflikt oder falsches Passwort | `nmcli connection show helmpflicht-ap`, `journalctl -u NetworkManager` |
| Kein Captive-Portal-Popup | dnsmasq läuft nicht oder Interface falsch | `systemctl status dnsmasq`, `ss -ulnp \| grep :53` |
| Handy zeigt Portal, aber Inhalt lädt nicht | nginx/backend Container down | `docker compose ps`, `docker compose logs -f` |
| Fotos verschwinden nach Neustart | Datenverzeichnis zeigt nicht auf SSD | `docker compose config` prüfen, ob Pfade auf `/mnt/festival-data` zeigen |
| dnsmasq-Port-Konflikt | `systemd-resolved` blockiert Port 53 | `sudo systemctl status systemd-resolved` (sollte inaktiv sein) |
