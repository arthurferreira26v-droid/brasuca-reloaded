export interface FormationPosition {
  x: number; // 0-100 (left to right)
  y: number; // 0-100 (top to bottom)
  role: string;
}

export interface Formation {
  id: string;
  name: string;
  positions: FormationPosition[];
}

export const formations: Formation[] = [
  {
    id: "4-4-2",
    name: "4-4-2",
    positions: [
      { x: 50, y: 95, role: "GOL" }, // Goleiro
      { x: 20, y: 75, role: "LD" },  // Lateral Direito
      { x: 40, y: 75, role: "ZAG" }, // Zagueiro
      { x: 60, y: 75, role: "ZAG" }, // Zagueiro
      { x: 80, y: 75, role: "LE" },  // Lateral Esquerdo
      { x: 20, y: 50, role: "MD" },  // Meio Direito
      { x: 40, y: 50, role: "MC" },  // Meio Central
      { x: 60, y: 50, role: "MC" },  // Meio Central
      { x: 80, y: 50, role: "ME" },  // Meio Esquerdo
      { x: 40, y: 20, role: "ATA" }, // Atacante
      { x: 60, y: 20, role: "ATA" }, // Atacante
    ],
  },
  {
    id: "4-3-3",
    name: "4-3-3",
    positions: [
      { x: 50, y: 95, role: "GOL" },
      { x: 20, y: 75, role: "LD" },
      { x: 40, y: 75, role: "ZAG" },
      { x: 60, y: 75, role: "ZAG" },
      { x: 80, y: 75, role: "LE" },
      { x: 35, y: 55, role: "VOL" },
      { x: 50, y: 50, role: "MC" },
      { x: 65, y: 55, role: "VOL" },
      { x: 20, y: 20, role: "PD" },
      { x: 50, y: 15, role: "ATA" },
      { x: 80, y: 20, role: "PE" },
    ],
  },
  {
    id: "3-5-2",
    name: "3-5-2",
    positions: [
      { x: 50, y: 95, role: "GOL" },
      { x: 30, y: 75, role: "ZAG" },
      { x: 50, y: 75, role: "ZAG" },
      { x: 70, y: 75, role: "ZAG" },
      { x: 15, y: 55, role: "ALD" },
      { x: 35, y: 50, role: "MC" },
      { x: 50, y: 45, role: "VOL" },
      { x: 65, y: 50, role: "MC" },
      { x: 85, y: 55, role: "ALE" },
      { x: 40, y: 20, role: "ATA" },
      { x: 60, y: 20, role: "ATA" },
    ],
  },
];

export const playStyles = [
  { id: "balanced", name: "Equilibrado", description: "Balanço entre ataque e defesa" },
  { id: "counter", name: "Contra-Ataque", description: "Defesa sólida, ataque rápido" },
  { id: "possession", name: "Posse de Bola", description: "Controle do jogo, passes curtos" },
  { id: "pressing", name: "Pressão", description: "Marcação alta, recuperação rápida" },
  { id: "defensive", name: "Defensivo", description: "Foco total na defesa" },
  { id: "attacking", name: "Ofensivo", description: "Ataque constante, risco maior" },
];
