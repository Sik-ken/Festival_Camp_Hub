# Deichdrucker – Website

Neugestaltung der Website **deichdrucker.de** – 3D-Druck, CAD-Design & 3D-Scan aus Emden.
Gebaut mit [Astro](https://astro.build) · dunkles, technisch-präzises Design (CAD/Blueprint-Look).

> Vollständiges Konzept & Redesign-Plan: siehe **[CONCEPT.md](./CONCEPT.md)**.

## Schnellstart

```bash
npm install
npm run dev      # Entwicklungsserver: http://localhost:4321
npm run build    # Produktions-Build nach ./dist
npm run preview  # gebaute Seite lokal ansehen
```

## Struktur

```
src/
  layouts/BaseLayout.astro     Grundgerüst, <head>, SEO, Header/Footer
  components/                  Header, Footer, Icon, SectionHeader
  pages/                       index, leistungen, projekte, lampen, ueber-uns, kontakt, impressum, datenschutz
  data/                        site, services, projects, products (Inhalte pflegen)
  styles/global.css            Design-System (Farben, Typo, Komponenten)
public/                        favicon & statische Assets (Fotos hier ablegen)
```

## Inhalte pflegen

- Texte/Leistungen/Produkte: `src/data/*.ts`
- Kontaktdaten & Navigation: `src/data/site.ts`
- Fotos: in `public/` ablegen und Platzhalter-`.frame`-Blöcke durch `<img>` ersetzen.

## Noch zu erledigen (siehe CONCEPT.md §9)

- [ ] Echtes Logo als SVG einsetzen
- [ ] Fonts (Space Grotesk / IBM Plex Mono) DSGVO-konform selbst hosten
- [ ] Echte Fotos & finale Texte
- [ ] Kontaktformular-Endpoint (z. B. Formspree/Netlify Forms)
- [ ] Impressum & Datenschutz vervollständigen
- [ ] Hosting einrichten & Domain verbinden
