import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TeamCard } from "@/components/TeamCard";
import { LeagueSelector } from "@/components/LeagueSelector";
import { teams, leagues } from "@/data/teams";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const [selectedLeague, setSelectedLeague] = useState("brasileiro");
  const navigate = useNavigate();

  const filteredTeams = teams.filter((team) => team.league === selectedLeague);

  const handleTeamSelect = (teamName: string) => {
    toast.success(`Time ${teamName} selecionado!`, {
      description: "Prepare-se para começar sua jornada rumo ao título!",
    });
    // Navigate to game page (we'll create this next)
    navigate(`/jogo?time=${teamName}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Selecione a Liga
          </h2>
        </div>

        <LeagueSelector
          leagues={leagues}
          selectedLeague={selectedLeague}
          onSelect={setSelectedLeague}
        />

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Escolha seu Time
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredTeams.map((team) => (
              <TeamCard
                key={team.id}
                name={team.name}
                logo={team.logo}
                rating={team.rating}
                onClick={() => handleTeamSelect(team.name)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 Gerenciador de Futebol
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
