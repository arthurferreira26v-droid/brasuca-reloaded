import { Player } from "@/data/players";
import { Formation } from "@/data/formations";

interface FormationFieldProps {
  formation: Formation;
  players: Player[];
}

export const FormationField = ({ formation, players }: FormationFieldProps) => {
  // Mapeia jogadores para posições da formação
  const getPlayerForPosition = (role: string) => {
    // Mapeia os roles da formação para as posições dos jogadores
    const positionMap: { [key: string]: string[] } = {
      GOL: ["GOL"],
      LD: ["LD"],
      LE: ["LE"],
      ZAG: ["ZAG"],
      VOL: ["VOL"],
      MC: ["MC", "VOL"], // MC pode usar VOL se não houver MC
      PE: ["PE"],
      PD: ["PD"],
      ATA: ["ATA"],
      MD: ["PD", "MC"], // Meio direito pode usar PD ou MC
      ME: ["PE", "MC"], // Meio esquerdo pode usar PE ou MC
      ALD: ["LD"], // Ala direito usa lateral direito
      ALE: ["LE"], // Ala esquerdo usa lateral esquerdo
    };

    const positions = positionMap[role] || [role];
    
    // Procura um jogador que ainda não foi usado e que tenha uma das posições válidas
    for (const pos of positions) {
      const player = players.find(p => p.position === pos && !usedPlayers.has(p.id));
      if (player) {
        usedPlayers.add(player.id);
        return player;
      }
    }
    
    return null;
  };

  const usedPlayers = new Set<string>();

  return (
    <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-green-800 to-green-900 rounded-lg overflow-hidden border-2 border-white/20">
      {/* Campo de futebol - linhas */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        {/* Linha do meio */}
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="2" />
        {/* Círculo central */}
        <circle cx="50%" cy="50%" r="60" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="50%" cy="50%" r="4" fill="white" />
        {/* Área grande de cima */}
        <rect x="25%" y="2%" width="50%" height="18%" fill="none" stroke="white" strokeWidth="2" />
        {/* Área pequena de cima */}
        <rect x="35%" y="2%" width="30%" height="10%" fill="none" stroke="white" strokeWidth="2" />
        {/* Área grande de baixo */}
        <rect x="25%" y="80%" width="50%" height="18%" fill="none" stroke="white" strokeWidth="2" />
        {/* Área pequena de baixo */}
        <rect x="35%" y="88%" width="30%" height="10%" fill="none" stroke="white" strokeWidth="2" />
      </svg>

      {/* Jogadores */}
      {formation.positions.map((pos, index) => {
        const player = getPlayerForPosition(pos.role);
        if (!player) return null;

        return (
          <div
            key={`${player.id}-${index}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            }}
          >
            {/* Círculo do jogador */}
            <div className="relative">
              <div className="w-10 h-10 bg-black border-2 border-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">{player.number}</span>
              </div>
            </div>
            {/* Nome do jogador */}
            <div className="bg-black/70 px-2 py-0.5 rounded text-white text-[10px] font-medium whitespace-nowrap">
              {player.name}
            </div>
            {/* Posição do jogador */}
            <div className="bg-black/70 px-2 py-0.5 rounded text-white text-[9px] font-semibold whitespace-nowrap">
              {player.position}
            </div>
          </div>
        );
      })}
    </div>
  );
};
