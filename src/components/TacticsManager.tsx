import { useState } from "react";
import { FormationField } from "@/components/FormationField";
import { TacticsSelector } from "@/components/TacticsSelector";
import { formations } from "@/data/formations";
import { botafogoPlayers, generateTeamPlayers } from "@/data/players";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TacticsManagerProps {
  teamName: string;
}

export const TacticsManager = ({ teamName }: TacticsManagerProps) => {
  const [selectedFormation, setSelectedFormation] = useState("4-3-3");
  const [selectedPlayStyle, setSelectedPlayStyle] = useState("counter");

  const formation = formations.find((f) => f.id === selectedFormation) || formations[0];
  
  // Use jogadores do Botafogo ou gere jogadores genéricos
  const players = teamName === "Botafogo" 
    ? botafogoPlayers 
    : generateTeamPlayers(teamName);

  return (
    <div className="bg-[#050B2B] border border-[#0a1540] rounded-lg p-4 md:p-6">
      <h2 className="text-xl font-bold text-white mb-4">Gerenciar Time</h2>
      
      <Tabs defaultValue="tactics" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-4">
          <TabsTrigger 
            value="tactics"
            className="data-[state=active]:bg-[#c8ff00] data-[state=active]:text-black"
          >
            Táticas
          </TabsTrigger>
          <TabsTrigger 
            value="lineup"
            className="data-[state=active]:bg-[#c8ff00] data-[state=active]:text-black"
          >
            Escalação
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tactics" className="space-y-4">
          <TacticsSelector
            selectedFormation={selectedFormation}
            selectedPlayStyle={selectedPlayStyle}
            onFormationChange={setSelectedFormation}
            onPlayStyleChange={setSelectedPlayStyle}
          />
        </TabsContent>

        <TabsContent value="lineup">
          <FormationField formation={formation} players={players} />
          
          {/* Lista de jogadores */}
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-white mb-2">Titulares</h3>
            <div className="space-y-1">
              {players.slice(0, 11).map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-white/5 rounded p-2 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black border border-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{player.number}</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{player.name}</p>
                      <p className="text-muted-foreground text-xs">{player.position}</p>
                    </div>
                  </div>
                  <div className="bg-[#c8ff00] px-2 py-1 rounded">
                    <span className="text-black text-xs font-bold">{player.overall}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
