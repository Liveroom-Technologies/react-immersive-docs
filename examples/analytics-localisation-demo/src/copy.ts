import type { LanguageCode } from "./labels";

type PartKey =
  | "body"
  | "hood"
  | "trunk"
  | "frontBumper"
  | "rearBumper"
  | "frontFenders"
  | "rearFenders"
  | "sideSkirts"
  | "frontLeftWheel"
  | "frontRightWheel"
  | "rearWheels"
  | "headlights"
  | "mirrors"
  | "exhaust"
  | "intercooler"
  | "windows"
  | "trim";

type Copy = {
  intro: string;
  step1: string;
  step4: string;
  scenes: { car: string; gallery: string };
  empty: string;
  console: string;
  clear: string;
  copyFailed: string;
  parts: Record<PartKey, string>;
  tour: Record<number, { title: string; description: string }>;
};

export const COPY: Record<LanguageCode, Copy> = {
  en: {
    intro: "Use the 3D view, and watch your actions show up below, the way your own app would receive them.",
    step1: "Pick a scene",
    step4: "Change the language",
    scenes: { car: "Car", gallery: "Art gallery" },
    empty: "Nothing yet. Try something from step 2.",
    console: "Also print them in the browser console",
    clear: "Clear events",
    copyFailed: "Couldn't copy to the clipboard",
    parts: {
      body: "Body",
      hood: "Hood",
      trunk: "Trunk",
      frontBumper: "Front bumper",
      rearBumper: "Rear bumper",
      frontFenders: "Front fenders",
      rearFenders: "Rear fenders",
      sideSkirts: "Side skirts",
      frontLeftWheel: "Front left wheel",
      frontRightWheel: "Front right wheel",
      rearWheels: "Rear wheels",
      headlights: "Headlights",
      mirrors: "Mirrors",
      exhaust: "Exhaust",
      intercooler: "Intercooler",
      windows: "Window",
      trim: "Trim",
    },
    tour: {
      1: { title: "Mushroom Forest", description: "Glowing mushrooms light a path through a misty, ancient forest." },
      2: { title: "Neon Dreams", description: "A portrait lit by pink and orange neon signs." },
      3: { title: "City Rush", description: "A crowded, high-energy city scene in bright pop colours." },
      4: { title: "Above the Clouds", description: "A jet climbs through painted clouds over a blue sea." },
      5: { title: "Night Shift", description: "A city portrait in a glowing orange jacket." },
      6: { title: "The Hoodie", description: "A soft, toy-like character figure in streetwear." },
      7: { title: "Cubist Muse", description: "A face built from bright geometric shapes and curves." },
    },
  },
  fr: {
    intro: "Utilisez la vue 3D et regardez vos actions apparaître ci-dessous, comme votre application les recevrait.",
    step1: "Choisissez une scène",
    step4: "Changez la langue",
    scenes: { car: "Voiture", gallery: "Galerie d'art" },
    empty: "Rien pour l'instant. Essayez une action de l'étape 2.",
    console: "Les afficher aussi dans la console du navigateur",
    clear: "Effacer les événements",
    copyFailed: "Impossible de copier dans le presse-papiers",
    parts: {
      body: "Carrosserie",
      hood: "Capot",
      trunk: "Coffre",
      frontBumper: "Pare-chocs avant",
      rearBumper: "Pare-chocs arrière",
      frontFenders: "Ailes avant",
      rearFenders: "Ailes arrière",
      sideSkirts: "Bas de caisse",
      frontLeftWheel: "Roue avant gauche",
      frontRightWheel: "Roue avant droite",
      rearWheels: "Roues arrière",
      headlights: "Phares",
      mirrors: "Rétroviseurs",
      exhaust: "Échappement",
      intercooler: "Intercooler",
      windows: "Vitre",
      trim: "Garniture",
    },
    tour: {
      1: { title: "Forêt de champignons", description: "Des champignons lumineux éclairent un chemin à travers une forêt ancienne et brumeuse." },
      2: { title: "Rêves de néon", description: "Un portrait éclairé par des enseignes au néon roses et orange." },
      3: { title: "Ville en effervescence", description: "Une scène urbaine animée et bondée, aux couleurs pop éclatantes." },
      4: { title: "Au-dessus des nuages", description: "Un avion monte à travers des nuages peints au-dessus d'une mer bleue." },
      5: { title: "Service de nuit", description: "Un portrait urbain dans une veste orange lumineuse." },
      6: { title: "Le sweat à capuche", description: "Un personnage doux, façon jouet, en tenue streetwear." },
      7: { title: "Muse cubiste", description: "Un visage fait de formes géométriques et de courbes vives." },
    },
  },
  es: {
    intro: "Usa la vista 3D y mira cómo tus acciones aparecen abajo, tal como las recibiría tu aplicación.",
    step1: "Elige una escena",
    step4: "Cambia el idioma",
    scenes: { car: "Coche", gallery: "Galería de arte" },
    empty: "Nada todavía. Prueba algo del paso 2.",
    console: "Mostrarlos también en la consola del navegador",
    clear: "Borrar eventos",
    copyFailed: "No se pudo copiar al portapapeles",
    parts: {
      body: "Carrocería",
      hood: "Capó",
      trunk: "Maletero",
      frontBumper: "Parachoques delantero",
      rearBumper: "Parachoques trasero",
      frontFenders: "Guardabarros delanteros",
      rearFenders: "Guardabarros traseros",
      sideSkirts: "Faldones laterales",
      frontLeftWheel: "Rueda delantera izquierda",
      frontRightWheel: "Rueda delantera derecha",
      rearWheels: "Ruedas traseras",
      headlights: "Faros",
      mirrors: "Retrovisores",
      exhaust: "Escape",
      intercooler: "Intercooler",
      windows: "Ventanilla",
      trim: "Moldura",
    },
    tour: {
      1: { title: "Bosque de setas", description: "Setas luminosas alumbran un camino por un bosque antiguo y brumoso." },
      2: { title: "Sueños de neón", description: "Un retrato iluminado por letreros de neón rosas y naranjas." },
      3: { title: "Ciudad a toda prisa", description: "Una escena urbana abarrotada y llena de energía, en colores pop." },
      4: { title: "Sobre las nubes", description: "Un avión asciende entre nubes pintadas sobre un mar azul." },
      5: { title: "Turno de noche", description: "Un retrato urbano con una chaqueta naranja brillante." },
      6: { title: "La sudadera", description: "Un personaje suave, como de juguete, con ropa urbana." },
      7: { title: "Musa cubista", description: "Un rostro hecho de formas geométricas y curvas vivas." },
    },
  },
  de: {
    intro: "Nutze die 3D-Ansicht und sieh zu, wie deine Aktionen unten erscheinen, so wie deine App sie empfängt.",
    step1: "Szene wählen",
    step4: "Sprache ändern",
    scenes: { car: "Auto", gallery: "Kunstgalerie" },
    empty: "Noch nichts. Probiere etwas aus Schritt 2.",
    console: "Auch in der Browser-Konsole ausgeben",
    clear: "Ereignisse löschen",
    copyFailed: "Kopieren in die Zwischenablage fehlgeschlagen",
    parts: {
      body: "Karosserie",
      hood: "Motorhaube",
      trunk: "Kofferraum",
      frontBumper: "Vordere Stoßstange",
      rearBumper: "Hintere Stoßstange",
      frontFenders: "Vordere Kotflügel",
      rearFenders: "Hintere Kotflügel",
      sideSkirts: "Seitenschweller",
      frontLeftWheel: "Rad vorne links",
      frontRightWheel: "Rad vorne rechts",
      rearWheels: "Hinterräder",
      headlights: "Scheinwerfer",
      mirrors: "Spiegel",
      exhaust: "Auspuff",
      intercooler: "Ladeluftkühler",
      windows: "Fenster",
      trim: "Zierteil",
    },
    tour: {
      1: { title: "Pilzwald", description: "Leuchtende Pilze erhellen einen Pfad durch einen nebligen, uralten Wald." },
      2: { title: "Neonträume", description: "Ein Porträt im Licht rosa und orange leuchtender Neonschilder." },
      3: { title: "Großstadthektik", description: "Eine volle, energiegeladene Stadtszene in knalligen Pop-Farben." },
      4: { title: "Über den Wolken", description: "Ein Jet steigt durch gemalte Wolken über einem blauen Meer." },
      5: { title: "Nachtschicht", description: "Ein Stadtporträt in einer leuchtend orangen Jacke." },
      6: { title: "Der Hoodie", description: "Eine weiche, spielzeugartige Figur in Streetwear." },
      7: { title: "Kubistische Muse", description: "Ein Gesicht aus leuchtenden geometrischen Formen und Kurven." },
    },
  },
};

/** Which readable part a car mesh belongs to, from its glTF node name. */
export function carPartKey(modelObjectId: string): PartKey {
  const id = modelObjectId.toLowerCase();
  if (id.startsWith("hood")) return "hood";
  if (id.startsWith("trunk")) return "trunk";
  if (id.startsWith("front_bumper")) return "frontBumper";
  if (id.startsWith("rear_bumper")) return "rearBumper";
  if (id.startsWith("front_fenders")) return "frontFenders";
  if (id.startsWith("rear_fenders")) return "rearFenders";
  if (id.startsWith("side_skirts")) return "sideSkirts";
  if (id.startsWith("front_left_wheel")) return "frontLeftWheel";
  if (id.startsWith("front_right_wheel")) return "frontRightWheel";
  if (id.startsWith("rear_wheels")) return "rearWheels";
  if (id.startsWith("headlight")) return "headlights";
  if (id.startsWith("mirrors")) return "mirrors";
  if (id.startsWith("exhaust")) return "exhaust";
  if (id.startsWith("intercooler")) return "intercooler";
  if (id.includes("window")) return "windows";
  if (id.includes("car_body")) return "body";
  return "trim";
}
