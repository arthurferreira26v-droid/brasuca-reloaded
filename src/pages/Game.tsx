import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GameMenu } from "@/components/GameMenu";
import { MatchCard } from "@/components/MatchCard";
import { TacticsManager } from "@/components/TacticsManager";
import { SquadManager } from "@/components/SquadManager";
import { TeamBudget } from "@/components/TeamBudget";
import { PlayerValueModal } from "@/components/PlayerValueModal";
import { TransferMarket } from "@/components/TransferMarket";
import { teams } from "@/data/teams";
import {
  botafogoPlayers,
  flamengoPlayers,
  generateTeamPlayers,
  Player,
} from "@/data/players";
import { Loader2 } from "lucide-react";
import { useChampionship } from "@/hooks/useChampionship";
import { useTeamForm } from "@/hooks/useTeamForm";
import { useTeamBudget } from "@/hooks/useTeamBudget";
import { getTeamLogo } from "@/utils/teamLogos";
import {
  calculateMarketValue,
  formatMarketValue,
} from "@/utils/marketValue";
import { toast } from "sonner";

const Game = () => {
  const [searchParams] = useSearchParams();
  const teamName = searchParams.get("time") || "Seu Time";

  const [showSquadManager, setShowSquadManager] = useState(false);
  const [showTransferMarket, setShowTransferMarket] = useState(false);
  const [selectedPlayerForValue, setSelectedPlayerForValue] =
    useState<Player | null>(null);
  const [selectedReserve, setSelectedReserve] =
    useState<Player | null>(null);

  // Inicializa jogadores
  const getInitialPlayers = () => {
    const savedPlayers = localStorage.getItem(`players_${teamName}`);
    if (savedPlayers) return JSON.parse(savedPlayers);

    if (teamName === "Botafogo") return botafogoPlayers;
    if (teamName === "Flamengo") return flamengoPlayers;
    return generateTeamPlayers(teamName);
  };

  const [players, setPlayers] = useState<Player[]>(getInitialPlayers);

  const updatePlayers = (updatedPlayers: Player[]) => {
    setPlayers(updatedPlayers);
    localStorage.setItem(
      `players_${teamName}`,
      JSON.stringify(updatedPlayers)
    );
  };

  const selectedTeam = teams.find((t) => t.name === teamName);

  // Campeonato
  const {
    championship,
    nextMatch,
    loading,
    isChampionComplete,
    userWonChampionship,
    resetChampionship,
  } = useChampionship(teamName);

  const championshipId = championship?.id;

  const isHome = nextMatch
    ? nextMatch.home_team_name === teamName
    : false;

  const opponentName = nextMatch
    ? isHome
      ? nextMatch.away_team_name
      : nextMatch.home_team_name
    : "";

  const opponentLogo = nextMatch
    ? isHome
      ? nextMatch.away_team_logo
      : nextMatch.home_team_logo
    : "";

  const { form: userForm, loading: userFormLoading } = useTeamForm(
    teamName,
    championshipId
  );

  const { form: opponentForm, loading: opponentFormLoading } =
    useTeamForm(opponentName, championshipId);

  const { budget, setBudget, loading: budgetLoading } = useTeamBudget(
    teamName,
    championshipId
  );

  const starters = players.filter((p) => p.isStarter);
  const reserves = players.filter((p) => !p.isStarter);

  const handleReserveClick = (player: Player) => {
    if (selectedReserve?.id === player.id) {
      setSelectedPlayerForValue(player);
      setSelectedReserve(null);
    } else {
      setSelectedReserve(player);
    }
  };

  const handleStarterClick = (starter: Player) => {
    if (!selectedReserve) {
      setSelectedPlayerForValue(starter);
      return;
    }

    if (starter.position !== selectedReserve.position) {
      alert("Os jogadores devem ter a mesma posição!");
      return;
    }

    const updatedPlayers = players.map((p) => {
      if (p.id === starter.id) return { ...p, isStarter: false };
      if (p.id === selectedReserve.id)
        return { ...p, isStarter: true };
      return p;
    });

    updatePlayers(updatedPlayers);
    setSelectedReserve(null);
  };

  const handleSellPlayer = (player: Player) => {
    const sellValue = Math.floor(
      calculateMarketValue(player.overall) * 0.8
    );

    updatePlayers(players.filter((p) => p.id !== player.id));
    setBudget(budget + sellValue);
    setSelectedPlayerForValue(null);

    toast.success(
      `${player.name} vendido por ${formatMarketValue(sellValue)}`
    );
  };

  const handleBuyPlayer = (player: Player, price: number) => {
    const newPlayer: Player = {
      ...player,
      id: `bought-${Date.now()}`,
      isStarter: false,
    };

    updatePlayers([...players, newPlayer]);
    setBudget(budget - price);

    toast.success(
      `${player.name} contratado por ${formatMarketValue(price)}`
    );
  };

  if (
    loading ||
    userFormLoading ||
    opponentFormLoading ||
    budgetLoading
  ) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#c8ff00]" />
      </div>
    );
  }

  if (isChampionComplete) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {userWonChampionship ? "🏆 CAMPEÃO!" : "Campeonato encerrado"}
          </h1>
          <button
            onClick={resetChampionship}
            className="bg-white text-black px-8 py-4 rounded-lg font-bold"
          >
            Avançar
          </button>
        </div>
      </div>
    );
  }

  if (!nextMatch) return null;

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-zinc-800 p-4 flex justify-between">
        <div className="flex items-center gap-3">
          <img
            src={selectedTeam?.logo}
            className="w-10 h-10"
            alt={teamName}
          />
          <span className="text-white font-bold">{teamName}</span>
        </div>

        <GameMenu
          teamName={teamName}
          championshipId={championshipId}
          onManageSquad={() => setShowSquadManager(true)}
          onTransferMarket={() => setShowTransferMarket(true)}
        />
      </header>

      <TeamBudget budget={budget} />

      <MatchCard
        userTeam={teamName}
        userLogo={getTeamLogo(teamName, selectedTeam?.logo || "")}
        opponentTeam={opponentName}
        opponentLogo={getTeamLogo(opponentName, opponentLogo)}
        round={`${nextMatch.round}ª Rodada`}
        userForm={userForm}
        opponentForm={opponentForm}
        isHome={isHome}
      />

      <TacticsManager
        teamName={teamName}
        players={starters}
        onStarterClick={handleStarterClick}
        canSubstitute={!!selectedReserve}
      />

      {showSquadManager && (
        <SquadManager
          players={players}
          onClose={() => setShowSquadManager(false)}
          onSquadChange={updatePlayers}
        />
      )}

      {selectedPlayerForValue && (
        <PlayerValueModal
          player={selectedPlayerForValue}
          onClose={() => setSelectedPlayerForValue(null)}
          canSell={!selectedPlayerForValue.isStarter}
          onSell={handleSellPlayer}
        />
      )}

      {showTransferMarket && (
        <TransferMarket
          budget={budget}
          onClose={() => setShowTransferMarket(false)}
          onBuyPlayer={handleBuyPlayer}
        />
      )}
    </div>
  );
};

export default Game;