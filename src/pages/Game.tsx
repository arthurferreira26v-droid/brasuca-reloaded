import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GameMenu } from "@/components/GameMenu";
import { MatchCard } from "@/components/MatchCard";
import { TacticsManager } from "@/components/TacticsManager";
import { SquadManager } from "@/components/SquadManager";
import { teams } from "@/data/teams";
import { botafogoPlayers, generateTeamPlayers, Player } from "@/data/players";
import { ChevronRight, Loader2 } from "lucide-react";
import { useChampionship } from "@/hooks/useChampionship";
import { useTeamForm } from "@/hooks/useTeamForm";
import { getTeamLogo } from "@/utils/teamLogos";

const Game = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const teamName = searchParams.get("time") || "Seu Time";
  const [showSquadManager, setShowSquadManager] = useState(false);
  
  // Initialize players state
  const initialPlayers = teamName === "Botafogo" 
    ? botafogoPlayers 
    : generateTeamPlayers(teamName);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  // Find the selected team
  const selectedTeam = teams.find(t => t.name === teamName);
  
  // Get championship data
  const { championship, nextMatch, loading, isChampionComplete, userWonChampionship, resetChampionship } = useChampionship(teamName);
  
  // Get Brazilian teams for the menu
  const brazilianTeams = teams.filter(
    t => t.league === "brasileiro" && t.name !== teamName
  );
  
  // Determine if user is home or away based on match data
  const isHome = nextMatch ? nextMatch.home_team_name === teamName : false;
  const opponentName = nextMatch 
    ? (isHome ? nextMatch.away_team_name : nextMatch.home_team_name)
    : "";
  const opponentLogo = nextMatch
    ? (isHome ? nextMatch.away_team_logo : nextMatch.home_team_logo)
    : "";

  // Buscar os últimos 5 resultados reais de cada time
  const { form: userForm, loading: userFormLoading } = useTeamForm(teamName, championship?.id);
  const { form: opponentForm, loading: opponentFormLoading } = useTeamForm(opponentName, championship?.id);

  if (loading || userFormLoading || opponentFormLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#c8ff00]" />
      </div>
    );
  }

  // Tela de fim de campeonato
  if (isChampionComplete && !loading) {
    if (userWonChampionship) {
      // Tela de celebração
      return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-500/20 via-black to-black flex items-center justify-center">
          <div className="text-center px-4 max-w-2xl">
            <div className="mb-8 animate-bounce">
              <div className="text-8xl mb-4">🏆</div>
              <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
                CAMPEÃO!
              </h1>
              <p className="text-2xl md:text-3xl text-white font-bold mb-2">
                {teamName}
              </p>
              <p className="text-lg text-muted-foreground">
                Parabéns! Você conquistou o Brasileirão 2024!
              </p>
            </div>
            
            <button
              onClick={resetChampionship}
              className="bg-white hover:bg-gray-100 text-black font-bold text-xl py-4 px-12 rounded-lg transition-all transform hover:scale-105"
            >
              Avançar
            </button>
          </div>
        </div>
      );
    } else {
      // Botão de avançar simples
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-3xl font-bold text-white mb-4">Campeonato Finalizado</h2>
            <p className="text-muted-foreground mb-8">O campeonato chegou ao fim.</p>
            
            <button
              onClick={resetChampionship}
              className="bg-white hover:bg-gray-100 text-black font-bold text-xl py-4 px-12 rounded-lg transition-colors"
            >
              Avançar
            </button>
          </div>
        </div>
      );
    }
  }

  if (!nextMatch && !loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#c8ff00] mb-4 mx-auto" />
          <p className="text-muted-foreground">Preparando próxima partida...</p>
        </div>
      </div>
    );
  }

  if (!nextMatch) {
    return null;
  }

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
          <GameMenu teamName={teamName} onManageSquad={() => setShowSquadManager(true)} />
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
      <div className="container mx-auto px-4 py-8">
        <MatchCard
          userTeam={teamName}
          userLogo={getTeamLogo(teamName, selectedTeam?.logo || "")}
          userPosition="1º"
          opponentTeam={opponentName}
          opponentLogo={getTeamLogo(opponentName, opponentLogo)}
          opponentPosition="8º"
          round={`${nextMatch.round}ª Rodada`}
          userForm={userForm}
          opponentForm={opponentForm}
          isHome={isHome}
        />
      </div>

      {/* Tactics Manager Section */}
      <div className="container mx-auto px-4 pb-12 pt-8">
        <TacticsManager teamName={teamName} players={players.filter(p => p.isStarter)} />
      </div>

      {/* Squad Manager Modal */}
      {showSquadManager && (
        <SquadManager
          players={players}
          onClose={() => setShowSquadManager(false)}
          onSquadChange={(updatedPlayers) => setPlayers(updatedPlayers)}
        />
      )}
    </div>
  );
};

export default Game;
