import { formations, playStyles } from "@/data/formations";
import { Button } from "@/components/ui/button";

interface TacticsSelectorProps {
  selectedFormation: string;
  selectedPlayStyle: string;
  onFormationChange: (formationId: string) => void;
  onPlayStyleChange: (styleId: string) => void;
}

export const TacticsSelector = ({
  selectedFormation,
  selectedPlayStyle,
  onFormationChange,
  onPlayStyleChange,
}: TacticsSelectorProps) => {
  return (
    <div className="space-y-4">
      {/* Formações */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Formação</h3>
        <div className="grid grid-cols-3 gap-2">
          {formations.map((formation) => (
            <Button
              key={formation.id}
              onClick={() => onFormationChange(formation.id)}
              variant="outline"
              className={`h-12 ${
                selectedFormation === formation.id
                  ? "bg-[#c8ff00] text-black border-[#c8ff00] hover:bg-[#b3e600] hover:text-black"
                  : "bg-white/5 text-white border-white/20 hover:bg-white/10"
              }`}
            >
              {formation.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Estilos de Jogo */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Estilo de Jogo</h3>
        <div className="grid grid-cols-2 gap-2">
          {playStyles.map((style) => (
            <Button
              key={style.id}
              onClick={() => onPlayStyleChange(style.id)}
              variant="outline"
              className={`h-auto py-3 flex flex-col items-start ${
                selectedPlayStyle === style.id
                  ? "bg-[#c8ff00] text-black border-[#c8ff00] hover:bg-[#b3e600] hover:text-black"
                  : "bg-white/5 text-white border-white/20 hover:bg-white/10"
              }`}
            >
              <span className="font-semibold text-sm">{style.name}</span>
              <span className="text-xs opacity-70 font-normal">{style.description}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
