export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  priceFrom?: string;
  options: string[];
}

export const products: Product[] = [
  {
    id: "emden-lampe",
    title: "Emden-Lampe",
    subtitle: "Lithophane mit Emder Wahrzeichen",
    description:
      "Ein Stück Emden als Lichtobjekt: Die Emden-Lampe zeigt lokale Wahrzeichen als feines Lithophane, das erst im Licht sein Motiv offenbart. Handgefertigt in Emden.",
    priceFrom: "auf Anfrage",
    options: ["Motivauswahl", "Warm-/Kaltlicht", "Sockelvarianten"],
  },
  {
    id: "personalisiert",
    title: "Personalisierte Lampen",
    subtitle: "Dein Foto als Lithophane-Lampe",
    description:
      "Dein Lieblingsfoto wird zur leuchtenden Erinnerung. Ich wandle dein Bild in ein Lithophane und fertige daraus eine individuelle Lampe – ein besonderes, persönliches Geschenk.",
    priceFrom: "auf Anfrage",
    options: ["Eigenes Foto", "Größe wählbar", "Geschenkverpackung"],
  },
];
