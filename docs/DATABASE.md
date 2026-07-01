# DATABASE.md
## SQLite-Datenmodell für Helmpflicht Hub

### 1. Grundprinzip
- SQLite speichert nur Metadaten.
- Bilder liegen im Dateisystem.
- Alle Aktionen erhalten Zeitstempel.
- Statusfelder sind explizit und einfach gehalten.

### 2. Tabellenübersicht
- users
- roles
- user_roles
- challenges
- user_challenges
- photos
- photo_versions optional
- funnels
- leaderboard_snapshots optional
- badges
- user_badges
- activity_events
- admin_actions
- settings

### 3. Tabellenbeschreibung

#### 3.1 users
Speichert Benutzerprofile.

Felder:
- id INTEGER PK
- festival_id TEXT UNIQUE
- pin_hash TEXT
- nickname TEXT UNIQUE or indexed
- hometown TEXT
- first_name TEXT NULL
- camp_name TEXT NULL
- crush TEXT NULL
- favorite_act TEXT NULL
- favorite_color TEXT NULL
- profile_photo_path TEXT
- points INTEGER DEFAULT 0
- level_name TEXT
- created_at DATETIME
- updated_at DATETIME
- last_login_at DATETIME NULL
- is_active INTEGER DEFAULT 1

Hinweise:
- Spitzname und Heimatort sind Pflicht.
- Profilbild ist Pflicht.
- PIN nur gehasht speichern.

#### 3.2 roles
- id INTEGER PK
- name TEXT UNIQUE
- description TEXT

Rollen:
- guest
- user
- funnel_watcher
- admin

#### 3.3 user_roles
- id INTEGER PK
- user_id INTEGER FK
- role_id INTEGER FK
- created_at DATETIME

#### 3.4 challenges
Speichert die 100 vorbereiteten Challenges.

Felder:
- id INTEGER PK
- title TEXT
- description TEXT
- points INTEGER
- unlock_points INTEGER DEFAULT 0
- is_open INTEGER DEFAULT 1
- sort_order INTEGER
- created_at DATETIME
- updated_at DATETIME

Regeln:
- 50 offen
- 50 gesperrt
- gesperrte Challenges benötigen Mindestpunkte

#### 3.5 user_challenges
Verknüpft Benutzer und Challenges.

Felder:
- id INTEGER PK
- user_id INTEGER FK
- challenge_id INTEGER FK
- status TEXT
- submitted_photo_id INTEGER FK NULL
- submitted_at DATETIME NULL
- completed_at DATETIME NULL
- approved_at DATETIME NULL
- admin_note TEXT NULL

Statuswerte:
- assigned
- submitted
- completed
- corrected

#### 3.6 photos
Speichert Fotometadaten.

Felder:
- id INTEGER PK
- user_id INTEGER FK NULL
- challenge_id INTEGER FK NULL
- upload_type TEXT
- original_path TEXT
- processed_path TEXT
- thumbnail_path TEXT
- caption TEXT NULL
- public INTEGER DEFAULT 1
- deleted INTEGER DEFAULT 0
- created_at DATETIME
- updated_at DATETIME

upload_type:
- photobooth
- challenge
- profile
- other

#### 3.7 funnels
Trichterliste.

Felder:
- id INTEGER PK
- user_id INTEGER FK
- count INTEGER DEFAULT 1
- note TEXT NULL
- created_by_user_id INTEGER FK NULL
- created_at DATETIME
- corrected_at DATETIME NULL

Hinweis:
- Für Version 1 wird jeder Eintrag +1 verwendet.
- Korrekturen dürfen nur Admin/Trichterwart.

#### 3.8 badges
- id INTEGER PK
- name TEXT UNIQUE
- icon TEXT
- description TEXT NULL
- points_threshold INTEGER NULL
- created_at DATETIME

#### 3.9 user_badges
- id INTEGER PK
- user_id INTEGER FK
- badge_id INTEGER FK
- awarded_at DATETIME

#### 3.10 activity_events
Kompakte Timeline / Live-Feed.

Felder:
- id INTEGER PK
- event_type TEXT
- user_id INTEGER FK NULL
- target_id INTEGER NULL
- message TEXT
- created_at DATETIME

Beispiele:
- user_registered
- photo_uploaded
- challenge_completed
- funnel_added
- badge_awarded
- admin_deleted_photo

#### 3.11 admin_actions
Audit-Protokoll.

Felder:
- id INTEGER PK
- admin_user_id INTEGER FK
- action_type TEXT
- target_type TEXT
- target_id INTEGER NULL
- before_json TEXT NULL
- after_json TEXT NULL
- created_at DATETIME

#### 3.12 settings
Globale Konfiguration.

Felder:
- id INTEGER PK
- key TEXT UNIQUE
- value TEXT
- updated_at DATETIME

Beispiele:
- camp_name
- public_frame_path
- slideshow_interval_ms
- gallery_retention_days optional

### 4. Indizes
Empfohlen:
- users(festival_id)
- users(nickname)
- photos(created_at)
- photos(user_id)
- photos(challenge_id)
- user_challenges(user_id, challenge_id)
- funnels(user_id)
- activity_events(created_at)

### 5. Statuslogik

#### 5.1 Challenge
- assigned = sichtbar oder gesperrt
- submitted = Foto hochgeladen
- completed = automatisch abgeschlossen
- corrected = Admin hat manuell geändert

#### 5.2 Foto
- public = sichtbar in Galerie
- deleted = nur logisch gelöscht, optional physisch entfernen

### 6. Datensicherheit
- PIN nur gehasht speichern
- Dateinamen nicht vom Client übernehmen
- Bilder validieren
- EXIF entfernen oder bereinigen
- Admin-Aktionen protokollieren

### 7. Migrationsstrategie
Für Version 1 kann die Datenbank über ein Startskript initialisiert werden. Später können Migrationen hinzugefügt werden.
