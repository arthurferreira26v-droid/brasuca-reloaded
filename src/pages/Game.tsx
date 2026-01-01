import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GameMenu } from "@/components/GameMenu";
import { TacticsManager } from "@/components/TacticsManager";
import { SquadManager } from "@/components/SquadManager";
import { TransferMarket } from "@/components/TransferMarket";
import { TeamBudget } from "@/components/TeamBudget";
import { Button } from "@/components/ui/button";
import { Play, Trophy, DollarSign, X } from "lucide-react";
import { useTeamBudget } from "@/hooks/useTeamBudget";
import { useChampionship } from "@/hooks/useChampionship";
import { Player, botafogoPlayers, flamengoPlayers, generateTeamPlayers } from "@/data/players";
import { getTeamLogo } from "@/utils/teamLogos";
import { toast } from "sonner";

const Game = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const teamName = searchParams.get("time") || "Botafogo";

  const [showSquadManager, setShowSquadManager] = useState(false);
  const [showTransferMarket, setShowTransferMarket] = useState(false);
  const [showFinances, setShowFinances] = useState(false);

  // Initialize players from localStorage or default
  const getInitialPlayers = () => {
    const savedPlayers = localStorage.getItem(`players_${teamName}`);
    if (savedPlayers) {
      return JSON.parse(savedPlayers);
    }
    return teamName === "Botafogo"
      ? botafogoPlayers
      : teamName === "Flamengo"
      ? flamengoPlayers
      : generateTeamPlayers(teamName);
  };

  const [players, setPlayers] = useState<Player[]>(getInitialPlayers);

  const {
    championship,
    nextMatch,
    loading: championshipLoading,
    isChampionComplete,
    userWonChampionship,
    resetChampionship,
  } = useChampionship(teamName);

  const { budget, setBudget, loading: budgetLoading } = useTeamBudget(teamName, championship?.id);

  // Save players to localStorage when they change
  useEffect(() => {
    localStorage.setItem(`players_${teamName}`, JSON.stringify(players));
  }, [players, teamName]);

  const starters = players.filter((p) => p.isStarter);
  const currentRound = championship?.current_round || 1;

  const handleSquadChange = (updatedPlayers: Player[]) => {
    setPlayers(updatedPlayers);
    toast.success("Escalação salva com sucesso!");
  };

  const handleBuyPlayer = (player: Player, price: number) => {
    const newPlayer = { ...player, id: `bought_${Date.now()}`, isStarter: false };
    setPlayers([...players, newPlayer]);
    setBudget(budget - price);
    toast.success(`${player.name} contratado com sucesso!`);
  };

  const handlePlayMatch = () => {
    if (nextMatch) {
      const isHome = nextMatch.home_team_name === teamName;
      const opponent = isHome ? nextMatch.away_team_name : nextMatch.home_team_name;
      navigate(
        `/partida?time=${teamName}&adversario=${opponent}&rodada=${nextMatch.round}&campeonatoId=${championship?.id}`
      );
    }
  };

  if (championshipLoading || budgetLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Championship complete screen
  if (isChampionComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          {userWonChampionship ? (
            <>
              <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground mb-2">🏆 Campeão!</h1>
              <p className="text-muted-foreground mb-6">
                Parabéns! {teamName} conquistou o título!
              </p>
            </>
          ) : (
            <>
              <Trophy className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground mb-2">Temporada Encerrada</h1>
              <p className="text-muted-foreground mb-6">
                A temporada terminou. Tente novamente!
              </p>
            </>
          )}
          <Button onClick={resetChampionship} className="w-full">
            Nova Temporada
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={getTeamLogo(teamName)}
              alt={teamName}
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-foreground">{teamName}</h1>
              <p className="text-sm text-muted-foreground">Rodada {currentRound}</p>
            </div>
          </div>
          <GameMenu
            teamName={teamName}
            championshipId={championship?.id}
            onManageSquad={() => setShowSquadManager(true)}
            onTransferMarket={() => setShowTransferMarket(true)}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Tactics Manager with Formation */}
        <TacticsManager teamName={teamName} players={starters} />

        {/* Next Match Card */}
        {nextMatch && (
          <div className="p-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Próxima Partida
              </h3>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={getTeamLogo(nextMatch.home_team_name)}
                    alt={nextMatch.home_team_name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="font-bold text-foreground">VS</span>
                  <img
                    src={getTeamLogo(nextMatch.away_team_name)}
                    alt={nextMatch.away_team_name}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">
                    {nextMatch.home_team_name === teamName ? nextMatch.away_team_name : nextMatch.home_team_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {nextMatch.home_team_name === teamName ? "Em Casa" : "Fora"}
                  </p>
                </div>
              </div>
              <Button
                onClick={handlePlayMatch}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Play className="w-4 h-4 mr-2" />
                Jogar Partida
              </Button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="p-4 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-16 flex-col gap-1"
            onClick={() => navigate(`/classificacao?time=${teamName}`)}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-xs">Classificação</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex-col gap-1"
            onClick={() => setShowFinances(true)}
          >
            <DollarSign className="w-5 h-5" />
            <span className="text-xs">Finanças</span>
          </Button>
        </div>
      </main>

      {/* Budget Footer */}
      <TeamBudget budget={budget} />

      {/* Squad Manager Modal */}
      {showSquadManager && (
        <SquadManager
          players={players}
          onClose={() => setShowSquadManager(false)}
          onSquadChange={handleSquadChange}
        />
      )}

      {/* Transfer Market Modal */}
      {showTransferMarket && (
        <TransferMarket
          budget={budget}
          onClose={() => setShowTransferMarket(false)}
          onBuyPlayer={handleBuyPlayer}
        />
      )}

      {/* Finances Modal */}
      {showFinances && (
        <div className="fixed inset-0 z-50 bg-black/95 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">Finanças</h2>
              </div>
              <button
                onClick={() => setShowFinances(false)}
                className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Budget Overview */}
            <div className="bg-gradient-to-r from-green-900/40 via-green-800/40 to-green-900/40 border border-green-700/50 rounded-xl p-6 mb-6">
              <p className="text-green-300/80 text-sm mb-1">Caixa Disponível</p>
              <p className="text-3xl font-bold text-green-400">
                $ {(budget / 1000000).toFixed(2)} M
              </p>
            </div>

            {/* Financial Summary */}
            <div className="space-y-4">
              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                <h3 className="text-white font-medium mb-3">Resumo Financeiro</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Receitas de Bilheteria</span>
                    <span className="text-green-400">+ $ 2.5 M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Patrocínios</span>
                    <span className="text-green-400">+ $ 5.0 M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Direitos de TV</span>
                    <span className="text-green-400">+ $ 8.0 M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Salários dos Jogadores</span>
                    <span className="text-red-400">- $ 3.5 M</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                <h3 className="text-white font-medium mb-3">Elenco</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Total de Jogadores</span>
                    <span className="text-white">{players.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Titulares</span>
                    <span className="text-white">{starters.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Reservas</span>
                    <span className="text-white">{players.length - starters.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
