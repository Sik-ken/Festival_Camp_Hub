export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

// Platzhalter-Projekte – später mit echten Fotos & Referenzen ersetzen.
export const projects: Project[] = [
  { id: "emden-lampe", title: "Emden-Lampe", description: "Lithophane-Lampe mit Emder Wahrzeichen als Lichtmotiv.", tags: ["SLA", "Produkt", "Licht"] },
  { id: "ersatzteil", title: "Ersatzteil-Nachbau", description: "Defektes Kunststoffteil per Scan digitalisiert und neu gedruckt.", tags: ["Scan", "FDM", "Reverse Eng."] },
  { id: "prototyp", title: "Gehäuse-Prototyp", description: "Funktionsprototyp für ein Elektronik-Gehäuse in mehreren Iterationen.", tags: ["CAD", "FDM", "Prototyp"] },
  { id: "miniatur", title: "Filigrane Miniatur", description: "Hochdetaillierte Figur im Harzdruck mit sauberer Oberfläche.", tags: ["SLA", "Detail"] },
  { id: "halterung", title: "Individuelle Halterung", description: "Maßgefertigte Halterung, in CAD konstruiert und robust gedruckt.", tags: ["CAD", "FDM"] },
  { id: "geschenk", title: "Personalisiertes Geschenk", description: "Individuelles Motiv als einzigartiges 3D-Objekt.", tags: ["Produkt", "Personalisiert"] },
];
