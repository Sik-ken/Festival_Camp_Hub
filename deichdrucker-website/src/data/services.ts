export interface Service {
  id: string;
  title: string;
  short: string;
  description: string;
  applications: string[];
  materials: string[];
  icon: "fdm" | "sla" | "cad" | "scan";
}

export const services: Service[] = [
  {
    id: "fdm",
    title: "FDM 3D-Druck",
    short: "Robuste Bauteile Schicht für Schicht – flexibel und wirtschaftlich.",
    description:
      "Im FDM-Verfahren fertige ich funktionale Teile aus thermoplastischen Kunststoffen. Ideal für Prototypen, Ersatzteile, Halterungen und Kleinserien – kostengünstig und stabil.",
    applications: ["Prototypen", "Ersatzteile", "Halterungen & Vorrichtungen", "Kleinserien"],
    materials: ["PLA", "PETG", "ABS/ASA", "TPU (flexibel)"],
    icon: "fdm",
  },
  {
    id: "sla",
    title: "SLA / MSLA Druck",
    short: "Hochauflösende Details aus UV-härtendem Harz.",
    description:
      "Für feinste Details und glatte Oberflächen nutze ich den Harzdruck. Perfekt für Miniaturen, filigrane Modelle, Schmuck-Prototypen und alles, wo Präzision zählt.",
    applications: ["Miniaturen & Figuren", "Filigrane Modelle", "Schmuck-Prototypen", "Feine Mechanik"],
    materials: ["Standard-Resin", "Tough-Resin", "Wasch- & härtbar"],
    icon: "sla",
  },
  {
    id: "cad",
    title: "CAD-Design",
    short: "Von der Skizze zum druckfertigen 3D-Modell.",
    description:
      "Du hast eine Idee, aber noch kein Modell? Ich konstruiere dein Bauteil in CAD – von der groben Skizze bis zur maßhaltigen, druckfertigen Datei.",
    applications: ["Konstruktion nach Skizze", "Ersatzteil-Nachbau", "Produktideen", "Optimierung für den Druck"],
    materials: ["STEP / STL", "Parametrisch", "Maßhaltig"],
    icon: "cad",
  },
  {
    id: "scan",
    title: "3D-Scan",
    short: "Reale Objekte präzise digitalisieren.",
    description:
      "Mit mobilem Handscanner digitalisiere ich vorhandene Objekte. So lassen sich Ersatzteile reproduzieren oder Formen als Basis für neue Designs erfassen.",
    applications: ["Reverse Engineering", "Ersatzteil-Erfassung", "Formabnahme", "Digitale Archivierung"],
    materials: ["Handscan mobil", "Nachbearbeitung", "Export für CAD"],
    icon: "scan",
  },
];
