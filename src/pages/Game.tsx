import { useSearchParams } from "react-router-dom";
import { GameMenu } from "@/components/GameMenu";
import { MatchCard } from "@/components/MatchCard";
import { teams } from "@/data/teams";

const Game = () => {
  const [searchParams] = useSearchParams();
  const teamName = searchParams.get("time") || "Seu Time";

  // Find the selected team
  const selectedTeam = teams.find(t => t.name === teamName);
  
  // Get a random opponent from Brazilian league
  const brazilianTeams = teams.filter(
    t => t.league === "brasileiro" && t.name !== teamName
  );
  const opponent = brazilianTeams[Math.floor(Math.random() * brazilianTeams.length)];

  // Generate random form (últimos 4 jogos)
  const generateForm = () => Array.from({ length: 4 }, () => Math.random() > 0.4);

  return (
    <div className="min-h-screen bg-[#0d1b2a]">
      {/* Simple Header */}
      <header className="border-b border-[#1e3a5f] bg-[#0d1b2a] backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-end">
          <GameMenu teamName={teamName} />
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
