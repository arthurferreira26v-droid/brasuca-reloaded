import { useState } from "react";
import { Player } from "@/data/players";
import { formations, playStyles } from "@/data/formations";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SquadManagerProps {
  players: Player[];
  onClose: () => void;
  onSquadChange: (updatedPlayers: Player[]) => void;
}

export const SquadManager = ({ players, onClose, onSquadChange }: SquadManagerProps) => {
  const [localPlayers, setLocalPlayers] = useState<Player[]>(players);
  const [selectedReserve, setSelectedReserve] = useState<Player | null>(null);
  const [selectedFormation, setSelectedFormation] = useState("4-3-3");
  const [selectedPlayStyle, setSelectedPlayStyle] = useState("counter");
  const [openDropdown, setOpenDropdown] = useState<"style" | "formation" | null>(null);

  const formation = formations.find((f) => f.id === selectedFormation) || formations[0];
  const playStyle = playStyles.find((s) => s.id === selectedPlayStyle) || playStyles[0];

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

  const toggleDropdown = (dropdown: "style" | "formation") => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
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
    ...getStartersByPosition("ATA"),
    ...getStartersByPosition("PD"),
  ];

  const PlayerCircle = ({ player, onClick, isClickable }: { player: Player; onClick?: () => void; isClickable?: boolean }) => (
    <div 
      className={`flex flex-col items-center ${isClickable ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="relative">
        {/* Overall - bolinha vermelha acima */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs z-10">
          {player.overall}
        </div>
        <div className={`w-12 h-12 rounded-full bg-white border-2 ${
          selectedReserve?.id === player.id ? 'border-[#c8ff00]' : 'border-white'
        } flex items-center justify-center text-black font-bold text-lg`}>
          {player.number}
        </div>
      </div>
      <span className="mt-1 text-white text-xs bg-black/70 px-2 py-0.5 rounded">{player.name}</span>
      <span className="text-white text-[10px] bg-black/70 px-2 py-0.5 rounded mt-0.5 font-semibold">{player.position}</span>
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
        <div className="relative w-full max-w-md mx-auto mb-4 bg-[#1a4d2e] rounded-xl overflow-hidden" style={{ height: '550px' }}>
          {/* Campo de futebol */}
          <svg viewBox="0 0 300 400" className="w-full h-full">
            {/* Fundo verde */}
            <rect width="300" height="400" fill="#1a4d2e" />
            
            {/* Linhas do campo */}
            <line x1="0" y1="200" x2="300" y2="200" stroke="white" strokeWidth="2" />
            <circle cx="150" cy="200" r="50" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="150" cy="200" r="3" fill="white" />
            
            {/* Área superior com bordas arredondadas */}
            <rect x="75" y="0" width="150" height="60" fill="none" stroke="white" strokeWidth="2" rx="8" />
            <rect x="120" y="0" width="60" height="25" fill="none" stroke="white" strokeWidth="2" rx="6" />
            
            {/* Área inferior com bordas arredondadas */}
            <rect x="75" y="340" width="150" height="60" fill="none" stroke="white" strokeWidth="2" rx="8" />
            <rect x="120" y="375" width="60" height="25" fill="none" stroke="white" strokeWidth="2" rx="6" />
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

        {/* Dropdowns de Estilo e Formação */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-6 px-4">
          {/* Estilo de Jogo */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("style")}
              className="w-full bg-white text-black rounded-lg px-4 py-3 flex items-center justify-between font-medium hover:bg-white/90 transition-colors"
            >
              <span>{playStyle.name}</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${openDropdown === "style" ? "rotate-180" : ""}`} />
            </button>
            
            {openDropdown === "style" && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg overflow-hidden shadow-lg z-50">
                {playStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setSelectedPlayStyle(style.id);
                      setOpenDropdown(null);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                      selectedPlayStyle === style.id ? "bg-[#c8ff00]" : ""
                    }`}
                  >
                    <div className="font-medium text-black">{style.name}</div>
                    <div className="text-xs text-gray-600">{style.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tática (Formação) */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("formation")}
              className="w-full bg-white text-black rounded-lg px-4 py-3 flex items-center justify-between font-medium hover:bg-white/90 transition-colors"
            >
              <span>{formation.name}</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${openDropdown === "formation" ? "rotate-180" : ""}`} />
            </button>
            
            {openDropdown === "formation" && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg overflow-hidden shadow-lg z-50">
                {formations.map((form) => (
                  <button
                    key={form.id}
                    onClick={() => {
                      setSelectedFormation(form.id);
                      setOpenDropdown(null);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                      selectedFormation === form.id ? "bg-[#c8ff00]" : ""
                    }`}
                  >
                    <div className="font-medium text-black">{form.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reservas */}
        <div className="bg-zinc-900 rounded-lg p-4 max-w-md mx-auto">
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
        <div className="max-w-md mx-auto mt-6">
          <Button onClick={handleSave} className="w-full bg-[#c8ff00] text-black hover:bg-[#b3e600] font-bold">
            Salvar Escalação
          </Button>
        </div>
      </div>
    </div>
  );
};
