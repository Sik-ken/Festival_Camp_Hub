# PUSH_NOTIFICATIONS.md
## Web-Push-Benachrichtigungen

> **Update (2026-07-04):** Ursprünglich war die App als Non-Goal ohne
> Push-Nachrichten geplant (siehe PRD.md, Kapitel 7 — mittlerweile entfernt).
> Seit dem Betrieb über den [Cloudflare Tunnel](REMOTE_ACCESS.md) läuft die
> App durchgehend über HTTPS, wodurch Web Push technisch sauber möglich ist.

### 1. Funktionsprinzip

Browser-native Web-Push-Benachrichtigungen (Push API + Service Worker),
kein Drittanbieter-SDK. Funktioniert nur, wenn die PWA installiert bzw. der
Browser-Tab die Berechtigung erteilt hat, und **erfordert HTTPS** (durch den
Cloudflare Tunnel gegeben).

Ausgelöst wird bei drei Ereignissen, jeweils als Broadcast an alle
registrierten Geräte außer dem des Auslösers selbst:

| Ereignis | Ausgelöst in | Ausgeschlossen |
|---|---|---|
| Challenge abgeschlossen | `backend/app/routers/challenges.py::submit_challenge` | Der Nutzer, der die Challenge abgeschlossen hat |
| Neues Foto (Fotobox) | `backend/app/routers/photobooth.py::create_photobooth_photo` | Der Nutzer, der das Foto hochgeladen hat (falls eingeloggt) |
| Trichter eingetragen | `backend/app/routers/funnels.py::add_funnel` | Der Nutzer, der getrunken hat |

Der Versand läuft asynchron als FastAPI `BackgroundTask` nach dem DB-Commit,
verzögert also nicht die eigentliche API-Antwort. Nicht mehr gültige
Subscriptions (Browser-Fehler 404/410, z. B. App deinstalliert) werden
automatisch aus der Datenbank entfernt.

### 2. Setup: VAPID-Schlüsselpaar erzeugen

Push benötigt ein VAPID-Schlüsselpaar (identifiziert den Server gegenüber
den Push-Diensten der Browser-Hersteller, z. B. Google/Mozilla). Einmalig
erzeugen (benötigt Node, z. B. im `frontend/`-Ordner ausführbar):

```bash
npx web-push generate-vapid-keys
```

Beide Werte in `.env` eintragen:

```env
HUB_VAPID_PUBLIC_KEY=<Public Key>
HUB_VAPID_PRIVATE_KEY=<Private Key>
HUB_VAPID_ADMIN_EMAIL=<beliebige Kontakt-Mailadresse>
```

Danach `docker compose up -d`, damit der Backend-Container die neuen Werte
lädt. Ohne gesetzte Keys bleibt Push serverseitig inaktiv (kein Fehler, die
`broadcast_push`-Funktion überspringt den Versand einfach).

### 3. Nutzersicht

- Im Profil (`/profile`) gibt es einen Ein-/Ausschalter „Benachrichtigungen
  aktivieren". Beim ersten Aktivieren fragt der Browser einmalig nach der
  Berechtigung.
- Deaktivieren löscht die Subscription serverseitig und im Browser.
- Wird keine Berechtigung erteilt oder ist Push serverseitig nicht
  konfiguriert, bleibt der Rest der App unverändert nutzbar — Push ist rein
  additiv.

### 4. Relevante Dateien

- Backend: `app/models.py` (`PushSubscription`), `app/routers/push.py`,
  `app/services/push.py`
- Frontend: `src/sw.ts` (Service Worker mit `push`/`notificationclick`-
  Handlern, `injectManifest`-Strategie statt `generateSW` — siehe
  `vite.config.ts`), `src/lib/push.ts` (Subscribe/Unsubscribe-Logik),
  `src/pages/Profile.tsx` (Toggle-UI)
