export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  overall: number;
}

// Escalação base do Botafogo (exemplo)
export const botafogoPlayers: Player[] = [
  { id: "1", name: "Lucas Perri", number: 1, position: "GOL", overall: 78 },
  { id: "2", name: "Rafael", number: 2, position: "LD", overall: 75 },
  { id: "3", name: "Adryelson", number: 3, position: "ZAG", overall: 76 },
  { id: "4", name: "Lucas Halter", number: 4, position: "ZAG", overall: 74 },
  { id: "5", name: "Hugo", number: 5, position: "LE", overall: 73 },
  { id: "6", name: "Marlon Freitas", number: 6, position: "VOL", overall: 77 },
  { id: "7", name: "Tchê Tchê", number: 7, position: "MC", overall: 75 },
  { id: "8", name: "Eduardo", number: 8, position: "MC", overall: 74 },
  { id: "9", name: "Tiquinho", number: 9, position: "ATA", overall: 78 },
  { id: "10", name: "Savarino", number: 10, position: "PD", overall: 80 },
  { id: "11", name: "Júnior Santos", number: 11, position: "PE", overall: 79 },
];

// Jogadores de outros times (exemplo genérico)
export const generateTeamPlayers = (teamName: string): Player[] => {
  const positions = [
    { pos: "GOL", name: "Goleiro" },
    { pos: "LD", name: "Lateral Direito" },
    { pos: "ZAG", name: "Zagueiro 1" },
    { pos: "ZAG", name: "Zagueiro 2" },
    { pos: "LE", name: "Lateral Esquerdo" },
    { pos: "VOL", name: "Volante" },
    { pos: "MC", name: "Meia Central 1" },
    { pos: "MC", name: "Meia Central 2" },
    { pos: "ATA", name: "Atacante 1" },
    { pos: "PD", name: "Ponta Direita" },
    { pos: "PE", name: "Ponta Esquerda" },
  ];

  return positions.map((p, i) => ({
    id: `${i + 1}`,
    name: p.name,
    number: i + 1,
    position: p.pos,
    overall: Math.floor(Math.random() * 15) + 70, // 70-85
  }));
};
