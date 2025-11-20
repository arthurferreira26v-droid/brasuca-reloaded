import { useState } from "react";
import { FormationField } from "@/components/FormationField";
import { formations, playStyles } from "@/data/formations";
import { botafogoPlayers, generateTeamPlayers } from "@/data/players";
import { ChevronDown } from "lucide-react";

interface TacticsManagerProps {
  teamName: string;
}

export const TacticsManager = ({ teamName }: TacticsManagerProps) => {
  const [selectedFormation, setSelectedFormation] = useState("4-3-3");
  const [selectedPlayStyle, setSelectedPlayStyle] = useState("counter");
  const [openDropdown, setOpenDropdown] = useState<"style" | "formation" | null>(null);

  const formation = formations.find((f) => f.id === selectedFormation) || formations[0];
  const playStyle = playStyles.find((s) => s.id === selectedPlayStyle) || playStyles[0];
  
  // Use jogadores do Botafogo ou gere jogadores genéricos
  const players = teamName === "Botafogo" 
    ? botafogoPlayers 
    : generateTeamPlayers(teamName);

  const toggleDropdown = (dropdown: "style" | "formation") => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <div className="bg-black p-4 md:p-6">
      {/* Botões de Estilo de Jogo e Tática */}
      <div className="grid grid-cols-2 gap-4 mb-6">
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

      {/* Campo */}
      <FormationField formation={formation} players={players} />
    </div>
  );
};
