import { useSearchParams, useNavigate } from "react-router-dom";
import { GameMenu } from "@/components/GameMenu";
import { MatchCard } from "@/components/MatchCard";
import { teams } from "@/data/teams";
import { ChevronRight } from "lucide-react";

const Game = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const teamName = searchParams.get("time") || "Seu Time";

  // Find the selected team
  const selectedTeam = teams.find(t => t.name === teamName);
  
  // Get a random opponent from Brazilian league
  const brazilianTeams = teams.filter(
    t => t.league === "brasileiro" && t.name !== teamName
  );
  const opponent = brazilianTeams[Math.floor(Math.random() * brazilianTeams.length)];

  // Generate random form (últimos 5 jogos)
  const generateForm = () => Array.from({ length: 5 }, () => Math.random() > 0.4);

  return (
    <div className="min-h-screen bg-black">
      {/* Header com info do time e menu */}
      <header className="border-b border-[#1a2c4a] bg-black backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Time selecionado - esquerda */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center p-1.5">
              <img src={selectedTeam?.logo} alt={teamName} className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">{teamName}</span>
              <span className="text-xs text-muted-foreground">Jj</span>
            </div>
          </div>

          {/* Menu hamburguer - direita */}
          <GameMenu teamName={teamName} />
        </div>

        {/* Menu horizontal de times */}
        <div className="border-t border-[#1a2c4a] bg-black">
          <div className="container mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
            {brazilianTeams.slice(0, 6).map((team) => (
              <button
                key={team.id}
                onClick={() => navigate(`/jogo?time=${team.name}`)}
                className="flex-shrink-0 w-14 h-14 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center p-2 transition-colors border border-white/10"
              >
                <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
              </button>
            ))}
            <button className="flex-shrink-0 w-14 h-14 bg-[#c8ff00] rounded-lg flex items-center justify-center transition-colors">
              <ChevronRight className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>
      </header>

      {/* Match Section */}
      <div className="container mx-auto px-4 py-12">
        <MatchCard
          homeTeam={opponent?.name || "Adversário"}
          homeLogo={opponent?.logo || ""}
          homePosition="8º"
          awayTeam={teamName}
          awayLogo={selectedTeam?.logo || ""}
          awayPosition="1º"
          round="7ª Rodada"
          homeForm={generateForm()}
          awayForm={generateForm()}
        />
      </div>
    </div>
  );
};

export default Game;
