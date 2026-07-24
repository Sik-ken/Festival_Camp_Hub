# Deichdrucker.de – Website-Konzept & Redesign-Plan

> Neugestaltung der Website für **Deichdrucker** – 3D-Druck, CAD-Design & 3D-Scan aus Emden (Ostfriesland).
> Inhaber: Lukas Sikken.

---

## 1. Strategie & Ziele

Die Website erfüllt gleichzeitig drei Aufgaben (in dieser Priorität):

1. **Können zeigen (Portfolio)** – Projekte, Druckqualität, CAD-Renderings und Produkte sichtbar machen.
2. **Marke etablieren** – Deichdrucker als professionellen, präzisen, verlässlichen Anbieter positionieren.
3. **Anfragen & Aufträge gewinnen** – jede Seite führt zu einem klaren nächsten Schritt (Anfrage/Bestellung).

**Kernbotschaft:** _„Präzise gefertigt in Emden – von der Idee über CAD und Scan bis zum fertigen 3D-Druck."_

**Zielgruppen:** Privatkund:innen (personalisierte Produkte, Geschenke, Ersatzteile), Maker & Tüftler, kleine Unternehmen / lokale Betriebe (Prototypen, Kleinserien), lokale Bezugsgruppe Emden/Ostfriesland.

---

## 2. Technik & Umsetzung

- **Framework:** Astro (statisch generiert) → sehr schnell, hervorragendes SEO, volle Design-Kontrolle, günstiges Hosting.
- **Styling:** eigenes, schlankes Design-System in CSS (keine schwere UI-Bibliothek nötig). Optional später Tailwind.
- **Sprache:** TypeScript für Datenmodelle (Leistungen, Projekte, Produkte).
- **Inhaltspflege:** Inhalte liegen als strukturierte Daten (`src/data/*.ts`) + Astro-Seiten vor. Später leicht auf ein Headless-CMS (z. B. Keystatic/Decap) erweiterbar.
- **Formulare:** Kontakt-/Bestellformular zunächst via `mailto`/Form-Endpoint (z. B. Formspree/Netlify Forms). DSGVO-freundlich, ohne Tracking.
- **Fonts:** selbst gehostet (DSGVO-konform, keine Google-Fonts-Einbindung).
- **Hosting-Empfehlung:** Netlify / Cloudflare Pages / Vercel (kostenlos für diese Größe) oder klassisches Webhosting mit statischem Upload.

---

## 3. Design-System

**Stilrichtung:** dunkel, clean, technisch-präzise, CAD-/Blueprint-Anmutung.

### Farben
| Rolle | Hex | Einsatz |
|---|---|---|
| Background (Base) | `#0A0E14` | Seitenhintergrund, tiefes Technik-Dunkel |
| Surface | `#121821` | Karten, Sektionsflächen |
| Surface-2 | `#1A2230` | Hover, abgesetzte Flächen |
| Border/Line | `#243040` | dünne technische Linien, Raster |
| Text | `#E6EDF3` | Fließtext, Überschriften |
| Text-Muted | `#8B98A5` | Sekundärtext, Labels |
| **Accent (CAD-Cyan)** | `#38BDF8` | technischer Akzent, Linien, Icons, Hervorhebungen |
| **Signal (CTA)** | `#F5A524` | Buttons/Call-to-Action, lenkt den Blick |

### Typografie
- **Headlines/Body:** moderne Grotesk (z. B. „Space Grotesk" / „Inter") – klar, technisch, gut lesbar.
- **Technische Labels & Zahlen:** Monospace (z. B. „IBM Plex Mono") – Koordinaten, Sektionsnummern, Tags (`// FDM · SLA · CAD`).

### Visuelle Motive (das „CAD-Gefühl")
- Feines **Blueprint-Raster** im Hintergrund (sehr dezent).
- **Sektionsnummerierung** wie in technischen Zeichnungen: `01 / 02 / 03`.
- **Eck-Ticks / Fadenkreuze** an Karten und Bildern.
- Dünne, präzise Linien; großzügiger Weißraum (bzw. „Dunkelraum").
- Monospace-Tags und Bemaßungs-Optik als Deko-Elemente.

---

## 4. Seitenstruktur (Sitemap)

```
/                 Startseite   – Hero, Leistungen, Projekte-Teaser, Produkte-Teaser, Ablauf, CTA
/leistungen       Leistungen   – FDM, SLA/MSLA, CAD-Design, 3D-Scan (je Block)
/projekte         Projekte     – Portfolio-Raster mit Referenzen
/lampen           Lampen       – Emden-Lampe & personalisierte Lithophane-Lampen (Produkte)
/ueber-uns        Über uns     – Lukas, Story, Standort Emden, Werte
/kontakt          Kontakt      – Anfrage-/Bestellformular, Kontaktdaten, Standort
```

Navigation: sticky Header mit Logo links, Menü rechts, prominenter „Anfrage"-Button (Signal-Farbe). Mobile: Burger-Menü.

---

## 5. Startseite – Wireframe (Sektion für Sektion)

1. **Hero** – kurze, starke Aussage + Untertitel + zwei CTAs („Projekt anfragen" / „Leistungen ansehen"). Blueprint-Hintergrund, Monospace-Tagline mit Standort/Leistungen.
2. **Leistungen (01)** – 4 Karten: FDM-Druck, SLA/MSLA-Druck, CAD-Design, 3D-Scan. Je Icon, Titel, Kurztext.
3. **Ablauf (02)** – „So läuft dein Auftrag": Idee → CAD/Scan → Druck → Fertig. 4 Schritte, technische Nummerierung.
4. **Projekte-Teaser (03)** – 3–6 ausgewählte Projekte im Raster, Link zur Projekte-Seite.
5. **Produkte-Teaser (04)** – Emden-Lampe & personalisierte Lampen als Highlight.
6. **Warum Deichdrucker (05)** – Vertrauen: lokal in Emden, Präzision, Beratung, faire Preise.
7. **CTA-Band** – „Hast du eine Idee? Lass sie uns drucken." + Anfrage-Button.
8. **Footer** – Kontakt, Social (Instagram/Facebook/WhatsApp/Telegram), Impressum/Datenschutz-Links.

---

## 6. Inhalts-Bausteine je Seite

- **Leistungen:** je Verfahren – Beschreibung, typische Anwendungen, Materialien, „passt für…". CTA je Block.
- **Projekte:** Karten mit Bild, Titel, kurzer Beschreibung, Tags (Verfahren/Material). Später Detailseiten möglich.
- **Lampen:** Produktkarten mit Bildern, Varianten (Motiv/Größe), Preis-ab-Angabe, Bestell-/Anfrage-CTA.
- **Über uns:** persönliche Story (Lukas, Emden), Werte (Präzision, Beratung, Regionalität), Foto/Werkstatt.
- **Kontakt:** Formular (Name, E-Mail, Betreff, Nachricht, optional Datei/Skizze-Hinweis), Direktkontakt, Standort Große Straße 35, 26721 Emden.

---

## 7. SEO & Rechtliches (DE)

- Sprechende URLs, saubere Meta-Titles/Descriptions je Seite, Open-Graph-Bilder.
- Lokales SEO: „3D-Druck Emden", „CAD Ostfriesland", „3D-Scan Emden".
- **Pflicht (DE):** Impressum & Datenschutzerklärung. Kein Google Fonts CDN (Fonts selbst hosten). Cookie-frei starten.
- Strukturierte Daten (LocalBusiness) für bessere lokale Sichtbarkeit.

---

## 8. Roadmap

- **Phase 1 (dieses Grundgerüst):** Design-System, Layout, Startseite + alle Hauptseiten mit Platzhaltern.
- **Phase 2:** echte Fotos, finale Texte, Logo als SVG, Formular-Endpoint anbinden.
- **Phase 3:** Projekt-Detailseiten, Impressum/Datenschutz, Feinschliff, Performance-/SEO-Check, Go-Live.
- **Phase 4 (optional):** Headless-CMS für einfache Pflege, kleiner Shop für Lampen.

---

## 9. Offene Punkte / brauche ich von dir

- Logo als **SVG/Vektor** (sonst baue ich ein sauberes Wortmarken-Logo als Platzhalter).
- **Fotos** von Projekten, Lampen, Werkstatt, ggf. Foto von dir für „Über uns".
- Finale **Texte** oder Stichpunkte je Leistung.
- Wunsch-**Akzentfarbe**, falls es feste Markenfarben gibt (aktuell CAD-Cyan + Signal-Amber).
- Ziel-**Hosting** und ob ein Kontaktformular-Dienst genutzt werden darf (Formspree o. ä.).
