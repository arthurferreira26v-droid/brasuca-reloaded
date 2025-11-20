export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  overall: number;
  isStarter?: boolean;
}

// Escalação completa do Botafogo
export const botafogoPlayers: Player[] = [
  // Goleiros
  { id: "22", name: "Neto", number: 22, position: "GOL", overall: 76, isStarter: false },
  { id: "24", name: "Léo Linck", number: 24, position: "GOL", overall: 80, isStarter: true },
  { id: "1", name: "Raul", number: 1, position: "GOL", overall: 75, isStarter: false },
  
  // Laterais
  { id: "2", name: "Vitinho", number: 2, position: "LD", overall: 77, isStarter: true },
  { id: "4", name: "Mateo Ponte", number: 4, position: "LD", overall: 75, isStarter: false },
  { id: "13", name: "Alex Telles", number: 13, position: "LE", overall: 82, isStarter: true },
  { id: "66", name: "Cuiabano", number: 66, position: "LE", overall: 74, isStarter: false },
  { id: "21", name: "Marçal", number: 21, position: "LE", overall: 73, isStarter: false },
  
  // Zagueiros
  { id: "31", name: "Kaio Pantaleão", number: 31, position: "ZAG", overall: 72, isStarter: false },
  { id: "20", name: "Alexander Barboza", number: 20, position: "ZAG", overall: 79, isStarter: true },
  { id: "15", name: "Bastos", number: 15, position: "ZAG", overall: 78, isStarter: false },
  { id: "57", name: "David Ricardo", number: 57, position: "ZAG", overall: 77, isStarter: true },
  
  // Volantes
  { id: "35", name: "Danilo", number: 35, position: "VOL", overall: 80, isStarter: true },
  { id: "17", name: "Marlon Freitas", number: 17, position: "VOL", overall: 81, isStarter: true },
  { id: "25", name: "Allan", number: 25, position: "VOL", overall: 76, isStarter: false },
  { id: "28", name: "Newton", number: 28, position: "VOL", overall: 74, isStarter: false },
  
  // Meias Ofensivos
  { id: "10", name: "Savarino", number: 10, position: "MC", overall: 83, isStarter: true },
  { id: "23", name: "Santi Rodríguez", number: 23, position: "MC", overall: 75, isStarter: false },
  { id: "8", name: "Álvaro Montoro", number: 8, position: "MC", overall: 73, isStarter: false },
  
  // Pontas
  { id: "7", name: "Artur", number: 7, position: "PD", overall: 78, isStarter: true },
  { id: "11", name: "Matheus Martins", number: 11, position: "PD", overall: 77, isStarter: false },
  { id: "47", name: "Jeffinho", number: 47, position: "PE", overall: 76, isStarter: false },
  { id: "16", name: "Nathan Fernandes", number: 16, position: "PD", overall: 74, isStarter: false },
  { id: "19", name: "Joaquin Correa", number: 19, position: "PE", overall: 79, isStarter: true },
  
  // Atacantes
  { id: "98", name: "Arthur Cabral", number: 98, position: "ATA", overall: 84, isStarter: true },
  { id: "39", name: "Gonzalo Mastriani", number: 39, position: "ATA", overall: 75, isStarter: false },
  { id: "9", name: "Chris Ramos", number: 9, position: "ATA", overall: 74, isStarter: false },
];

// Jogadores de outros times (exemplo genérico)
export const generateTeamPlayers = (teamName: string): Player[] => {
  const positions = [
    { pos: "GOL", name: "Goleiro", isStarter: true },
    { pos: "GOL", name: "Goleiro Reserva", isStarter: false },
    { pos: "LD", name: "Lateral Direito", isStarter: true },
    { pos: "LD", name: "LD Reserva", isStarter: false },
    { pos: "ZAG", name: "Zagueiro 1", isStarter: true },
    { pos: "ZAG", name: "Zagueiro 2", isStarter: true },
    { pos: "ZAG", name: "ZAG Reserva", isStarter: false },
    { pos: "LE", name: "Lateral Esquerdo", isStarter: true },
    { pos: "LE", name: "LE Reserva", isStarter: false },
    { pos: "VOL", name: "Volante 1", isStarter: true },
    { pos: "VOL", name: "Volante 2", isStarter: true },
    { pos: "VOL", name: "VOL Reserva", isStarter: false },
    { pos: "MC", name: "Meia Central", isStarter: true },
    { pos: "MC", name: "MC Reserva", isStarter: false },
    { pos: "ATA", name: "Atacante", isStarter: true },
    { pos: "ATA", name: "ATA Reserva", isStarter: false },
    { pos: "PD", name: "Ponta Direita", isStarter: true },
    { pos: "PD", name: "PD Reserva", isStarter: false },
    { pos: "PE", name: "Ponta Esquerda", isStarter: true },
    { pos: "PE", name: "PE Reserva", isStarter: false },
  ];

  return positions.map((p, i) => ({
    id: `${i + 1}`,
    name: p.name,
    number: i + 1,
    position: p.pos,
    overall: Math.floor(Math.random() * 15) + 70, // 70-85
    isStarter: p.isStarter,
  }));
};
