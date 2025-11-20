import { useState } from "react";
import { Player } from "@/data/players";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SquadManagerProps {
  players: Player[];
  onClose: () => void;
  onSquadChange: (updatedPlayers: Player[]) => void;
}

export const SquadManager = ({ players, onClose, onSquadChange }: SquadManagerProps) => {
  const [localPlayers, setLocalPlayers] = useState<Player[]>(players);
  const [selectedReserve, setSelectedReserve] = useState<Player | null>(null);

  const starters = localPlayers.filter(p => p.isStarter);
  const reserves = localPlayers.filter(p => !p.isStarter);

  const handleReserveClick = (player: Player) => {
    setSelectedReserve(player);
  };

  const handleStarterClick = (starter: Player) => {
    if (!selectedReserve) return;
    
    // Verificar se as posições são compatíveis
    if (starter.position !== selectedReserve.position) {
      alert("Os jogadores devem ter a mesma posição para serem substituídos!");
      return;
    }

    // Fazer a troca
    const updatedPlayers = localPlayers.map(p => {
      if (p.id === starter.id) {
        return { ...p, isStarter: false };
      }
      if (p.id === selectedReserve.id) {
        return { ...p, isStarter: true };
      }
      return p;
    });

    setLocalPlayers(updatedPlayers);
    setSelectedReserve(null);
  };

  const handleSave = () => {
    onSquadChange(localPlayers);
    onClose();
  };

  // Organizar titulares por posição para o campo
  const getStartersByPosition = (position: string) => {
    return starters.filter(p => p.position === position);
  };

  const goalkeeper = getStartersByPosition("GOL")[0];
  const defenders = [
    ...getStartersByPosition("LE"),
    ...getStartersByPosition("ZAG"),
    ...getStartersByPosition("LD"),
  ];
  const midfielders = [
    ...getStartersByPosition("VOL"),
    ...getStartersByPosition("MC"),
  ];
  const forwards = [
    ...getStartersByPosition("PE"),
    ...getStartersByPosition("PD"),
    ...getStartersByPosition("ATA"),
  ];

  const PlayerCircle = ({ player, onClick, isClickable }: { player: Player; onClick?: () => void; isClickable?: boolean }) => (
    <div 
      className={`flex flex-col items-center ${isClickable ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="relative">
        <div className={`w-12 h-12 rounded-full bg-white border-2 ${
          selectedReserve?.id === player.id ? 'border-[#c8ff00]' : 'border-white'
        } flex items-center justify-center text-black font-bold text-lg`}>
          {player.number}
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#c8ff00] flex items-center justify-center text-black text-xs font-bold">
          {player.overall}
        </div>
      </div>
      <span className="mt-1 text-white text-xs bg-black/70 px-2 py-0.5 rounded">{player.name}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-2xl font-bold">Gerenciar Elenco</h2>
          <button onClick={onClose} className="text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Campo com titulares */}
        <div className="relative w-full aspect-[3/4] max-w-2xl mx-auto mb-6">
          {/* Campo de futebol */}
          <svg viewBox="0 0 300 400" className="w-full h-full">
            {/* Fundo verde */}
            <rect width="300" height="400" fill="#2d5016" />
            
            {/* Linhas do campo */}
            <line x1="0" y1="200" x2="300" y2="200" stroke="white" strokeWidth="2" />
            <circle cx="150" cy="200" r="50" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="150" cy="200" r="3" fill="white" />
            
            {/* Área superior */}
            <rect x="75" y="0" width="150" height="60" fill="none" stroke="white" strokeWidth="2" />
            <rect x="120" y="0" width="60" height="25" fill="none" stroke="white" strokeWidth="2" />
            
            {/* Área inferior */}
            <rect x="75" y="340" width="150" height="60" fill="none" stroke="white" strokeWidth="2" />
            <rect x="120" y="375" width="60" height="25" fill="none" stroke="white" strokeWidth="2" />
          </svg>

          {/* Posicionar jogadores */}
          <div className="absolute inset-0">
            {/* Goleiro */}
            {goalkeeper && (
              <div className="absolute" style={{ bottom: '3%', left: '50%', transform: 'translateX(-50%)' }}>
                <PlayerCircle player={goalkeeper} onClick={() => handleStarterClick(goalkeeper)} isClickable={!!selectedReserve} />
              </div>
            )}

            {/* Defensores */}
            <div className="absolute flex justify-around items-center w-full px-8" style={{ bottom: '20%' }}>
              {defenders.map(player => (
                <PlayerCircle key={player.id} player={player} onClick={() => handleStarterClick(player)} isClickable={!!selectedReserve} />
              ))}
            </div>

            {/* Meio-campistas */}
            <div className="absolute flex justify-around items-center w-full px-8" style={{ bottom: '45%' }}>
              {midfielders.map(player => (
                <PlayerCircle key={player.id} player={player} onClick={() => handleStarterClick(player)} isClickable={!!selectedReserve} />
              ))}
            </div>

            {/* Atacantes */}
            <div className="absolute flex justify-around items-center w-full px-8" style={{ bottom: '70%' }}>
              {forwards.map(player => (
                <PlayerCircle key={player.id} player={player} onClick={() => handleStarterClick(player)} isClickable={!!selectedReserve} />
              ))}
            </div>
          </div>
        </div>

        {/* Reservas */}
        <div className="bg-zinc-900 rounded-lg p-4 max-w-2xl mx-auto">
          <h3 className="text-white text-xl font-bold mb-4">Reservas</h3>
          <div className="space-y-2">
            {reserves.map(player => (
              <button
                key={player.id}
                onClick={() => handleReserveClick(player)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  selectedReserve?.id === player.id 
                    ? 'bg-[#c8ff00] text-black' 
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">{player.number}</span>
                  <div className="text-left">
                    <div className="font-medium">{player.name}</div>
                    <div className="text-sm opacity-70">{player.position}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{player.overall}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Instruções */}
        {selectedReserve && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#c8ff00] text-black px-6 py-3 rounded-lg font-medium">
            Clique no titular para substituir
          </div>
        )}

        {/* Botão Salvar */}
        <div className="max-w-2xl mx-auto mt-6">
          <Button onClick={handleSave} className="w-full bg-[#c8ff00] text-black hover:bg-[#b3e600] font-bold">
            Salvar Escalação
          </Button>
        </div>
      </div>
    </div>
  );
};
