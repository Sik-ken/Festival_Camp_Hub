# CHALLENGE_SYSTEM.md
## Challenge-System für Helmpflicht Hub

### 1. Ziel
Das Challenge-System motiviert Besucher, das gesamte Festivalgelände aktiv zu nutzen, neue Menschen kennenzulernen, an Bühnen, im Infield, an der Beach Area, auf dem Campingplatz und bei Party- oder Trinkspiel-Situationen Fotos zu machen.

### 2. Grundregeln
- Jede Challenge ist grundsätzlich für jeden Benutzer machbar.
- Jede Challenge kann pro Benutzer genau einmal abgeschlossen werden.
- Jede Challenge erfordert genau ein Foto als Nachweis.
- Challenge-Punkte sind dauerhaft.
- Der Fortschritt wird nach Login persönlich angezeigt.
- Gesperrte Challenges werden bei Erreichen der nötigen Punkte freigeschaltet.

### 3. Struktur
- 100 Gesamt-Challenges
- 50 offene Challenges
- 50 gesperrte Challenges
- Schwierigkeit steigt mit Punkten
- Titel und Beschreibung müssen konkret sein
- Aufgaben müssen ohne spezielle Hilfsmittel vor Ort machbar sein

### 4. Punkteprinzip
Einfaches Modell:
- kleine Aufgabe = 10 bis 20 Punkte
- mittlere Aufgabe = 30 bis 60 Punkte
- schwere Aufgabe = 75 bis 125 Punkte
- legendäre Aufgabe = 150 bis 250 Punkte

### 5. Freischaltlogik
Ein Vorschlag für Version 1:
- offene Challenges: unlock_points = 0
- gesperrte Challenges: unlock_points z. B. 500, 1000, 2000 je nach Stufe

Für Claude gilt:
- Die Schwellenwerte dürfen in der Implementierung einfach gehalten werden.
- Die konkrete Freischaltung ist über eine Spalte `unlock_points` abbildbar.

### 6. Datenmodell für Challenges
Empfohlene Felder:
- id
- title
- description
- points
- unlock_points
- is_open
- sort_order

### 7. Challenge-Typen
Die Aufgaben sollten inhaltlich in der Datenbank als einfache Texte gespeichert werden, ohne komplizierte Kategorienlogik für Version 1.

#### Beispiele für typische Inhalte
- Selfie vor einer Bühne
- Foto mit unbekannten Festivalbesuchern
- Foto während eines Trinkspiels
- Foto im Infield
- Foto an der Beach Area
- Foto bei Nacht
- Foto bei Sonnenaufgang
- Foto mit einer großen Gruppe
- Foto mit Bauhelm oder Warnweste
- Foto vor einem Konzert
- Foto mit Personen aus verschiedenen Städten

### 8. Umsetzungshinweise für die App
- Die Challenge-Detailseite soll klar zeigen:
  - Titel
  - Punkte
  - Beschreibung
  - Status
  - Upload-Button
- Nach Upload:
  - Status automatisch abgeschlossen
  - Punkte direkt gutschreiben
  - Event in Activity Feed schreiben
- Falls Admin korrigiert:
  - Status und Punkte bleiben auditierbar

### 9. Fortschritt
Nach Login sollte der Benutzer sehen:
- aktuelle Punkte
- aktuelles Level / Rang
- Anzahl erledigter Challenges
- Anzahl offener Challenges
- Liste seiner abgeschlossenen Challenges

### 10. Level-Logik
Levelnamen sind thematisch an Camp Helmpflicht gebunden. Ein einfacher Schwellenwert-Ansatz genügt für Version 1.

Beispiel:
- Praktikant
- Handlanger
- Grubengräber
- Schaufelbeauftragter
- Polier
- Bauingenieur
- Bauleiter
- Camp Bürgermeister
- Bierkönig
- Helmpflicht Legende

### 11. Keine Komplexitätsfalle
Für Version 1:
- keine mehreren Bilder pro Challenge
- keine Challenge-Kommentare
- keine Social Features
- keine automatische Bildauswertung
- keine Tages-Challenges
- keine Zeitfenster
- keine Gruppen-Challenges als eigene Objekte

### 12. Zielwert für erste Implementierung
Das System soll komplett einfach, robust und von Claude schnell implementierbar sein. Die 100 fertigen Texte sind die Grundlage; die App muss nur noch die Zuordnung, Freischaltung und den Upload-Flow abbilden.
