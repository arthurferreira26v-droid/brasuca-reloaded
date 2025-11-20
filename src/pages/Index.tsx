import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TeamCard } from "@/components/TeamCard";
import { LeagueSelector } from "@/components/LeagueSelector";
import { teams, leagues } from "@/data/teams";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { toast } from "sonner";
import stadiumHero from "@/assets/stadium-hero.jpg";

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
      {/* Hero Section */}
      <div 
        className="relative h-[40vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)), url(${stadiumHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 text-center space-y-6 px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-12 w-12 text-primary animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tight">
              BRASUCA
            </h1>
            <Trophy className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground font-semibold">
            Escolha seu time e conquiste o mundo!
          </p>
        </div>
      </div>

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
            © 2025 Brasuca - Gerenciador de Futebol
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
