// @ts-nocheck - Database types will be updated after migration
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { teams } from "@/data/teams";
import { botafogoPlayers, generateTeamPlayers, Player } from "@/data/players";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TacticsManager } from "@/components/TacticsManager";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Match = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const teamName = searchParams.get("time") || "Seu Time";
  const opponentName = searchParams.get("adversario") || "Adversário";

  const [minute, setMinute] = useState(1);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [possession, setPossession] = useState({ home: 50, away: 50 });
  const [shots, setShots] = useState({ home: 0, away: 0 });
  const [fouls, setFouls] = useState({ home: 0, away: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSavingMatch, setIsSavingMatch] = useState(false);

  const selectedTeam = teams.find(t => t.name === teamName);
  const opponent = teams.find(t => t.name === opponentName);

  // Initialize players
  const userPlayers = teamName === "Botafogo" ? botafogoPlayers : generateTeamPlayers(teamName);
  const opponentPlayers = opponentName === "Botafogo" ? botafogoPlayers : generateTeamPlayers(opponentName);
  const userStarters = userPlayers.filter(p => p.isStarter);
  const opponentStarters = opponentPlayers.filter(p => p.isStarter);

  const saveMatchResult = async () => {
    if (isSavingMatch) return;
    setIsSavingMatch(true);

    try {
      // Buscar a partida atual
      const { data: championship } = await supabase
        .from("championships")
        .select("id")
        .eq("name", `Brasileirão - ${teamName}`)
        .single();

      if (!championship) throw new Error("Campeonato não encontrado");

      const { data: match } = await supabase
        .from("matches")
        .select("*")
        .eq("championship_id", championship.id)
        .eq("is_played", false)
        .or(`home_team_name.eq.${teamName},away_team_name.eq.${teamName}`)
        .order("round", { ascending: true })
        .limit(1)
        .single();

      if (!match) throw new Error("Partida não encontrada");

      // Atualizar resultado da partida
      await supabase
        .from("matches")
        .update({
          home_score: homeScore,
          away_score: awayScore,
          is_played: true,
        })
        .eq("id", match.id);

      // Atualizar classificação - sistema de pontos: vitória=3, empate=1, derrota=0
      const homeTeamName = match.home_team_name;
      const awayTeamName = match.away_team_name;

      const { data: standings } = await supabase
        .from("standings")
        .select("*")
        .eq("championship_id", championship.id)
        .in("team_name", [homeTeamName, awayTeamName]);

      if (standings && standings.length === 2) {
        const homeStanding = standings.find(s => s.team_name === homeTeamName);
        const awayStanding = standings.find(s => s.team_name === awayTeamName);

        if (homeStanding && awayStanding) {
          let homePoints = 0;
          let awayPoints = 0;
          let homeWins = 0;
          let awayWins = 0;
          let homeDraws = 0;
          let awayDraws = 0;
          let homeLosses = 0;
          let awayLosses = 0;

          if (homeScore > awayScore) {
            homePoints = 3; // Vitória
            homeWins = 1;
            awayLosses = 1;
          } else if (homeScore < awayScore) {
            awayPoints = 3; // Vitória
            awayWins = 1;
            homeLosses = 1;
          } else {
            homePoints = 1; // Empate
            awayPoints = 1; // Empate
            homeDraws = 1;
            awayDraws = 1;
          }

          await supabase.from("standings").update({
            points: homeStanding.points + homePoints,
            played: homeStanding.played + 1,
            wins: homeStanding.wins + homeWins,
            draws: homeStanding.draws + homeDraws,
            losses: homeStanding.losses + homeLosses,
            goals_for: homeStanding.goals_for + homeScore,
            goals_against: homeStanding.goals_against + awayScore,
            goal_difference: (homeStanding.goals_for + homeScore) - (homeStanding.goals_against + awayScore),
          }).eq("id", homeStanding.id);

          await supabase.from("standings").update({
            points: awayStanding.points + awayPoints,
            played: awayStanding.played + 1,
            wins: awayStanding.wins + awayWins,
            draws: awayStanding.draws + awayDraws,
            losses: awayStanding.losses + awayLosses,
            goals_for: awayStanding.goals_for + awayScore,
            goals_against: awayStanding.goals_against + homeScore,
            goal_difference: (awayStanding.goals_for + awayScore) - (awayStanding.goals_against + homeScore),
          }).eq("id", awayStanding.id);
        }
      }

      // Simular jogos dos outros times na mesma rodada
      const currentRound = match.round;
      const { data: otherMatches } = await supabase
        .from("matches")
        .select("*")
        .eq("championship_id", championship.id)
        .eq("round", currentRound)
        .eq("is_played", false)
        .neq("id", match.id);

      if (otherMatches && otherMatches.length > 0) {
        for (const otherMatch of otherMatches) {
          // Simular resultado aleatório mas realista
          const homeGoals = Math.floor(Math.random() * 4); // 0-3 gols
          const awayGoals = Math.floor(Math.random() * 4); // 0-3 gols

          // Atualizar partida
          await supabase
            .from("matches")
            .update({
              home_score: homeGoals,
              away_score: awayGoals,
              is_played: true,
            })
            .eq("id", otherMatch.id);

          // Atualizar classificação dos times
          const { data: otherStandings } = await supabase
            .from("standings")
            .select("*")
            .eq("championship_id", championship.id)
            .in("team_name", [otherMatch.home_team_name, otherMatch.away_team_name]);

          if (otherStandings && otherStandings.length === 2) {
            const homeStanding = otherStandings.find(s => s.team_name === otherMatch.home_team_name);
            const awayStanding = otherStandings.find(s => s.team_name === otherMatch.away_team_name);

            if (homeStanding && awayStanding) {
              let homePoints = 0;
              let awayPoints = 0;
              let homeWins = 0;
              let awayWins = 0;
              let homeDraws = 0;
              let awayDraws = 0;
              let homeLosses = 0;
              let awayLosses = 0;

              if (homeGoals > awayGoals) {
                homePoints = 3;
                homeWins = 1;
                awayLosses = 1;
              } else if (homeGoals < awayGoals) {
                awayPoints = 3;
                awayWins = 1;
                homeLosses = 1;
              } else {
                homePoints = 1;
                awayPoints = 1;
                homeDraws = 1;
                awayDraws = 1;
              }

              await supabase.from("standings").update({
                points: homeStanding.points + homePoints,
                played: homeStanding.played + 1,
                wins: homeStanding.wins + homeWins,
                draws: homeStanding.draws + homeDraws,
                losses: homeStanding.losses + homeLosses,
                goals_for: homeStanding.goals_for + homeGoals,
                goals_against: homeStanding.goals_against + awayGoals,
                goal_difference: (homeStanding.goals_for + homeGoals) - (homeStanding.goals_against + awayGoals),
              }).eq("id", homeStanding.id);

              await supabase.from("standings").update({
                points: awayStanding.points + awayPoints,
                played: awayStanding.played + 1,
                wins: awayStanding.wins + awayWins,
                draws: awayStanding.draws + awayDraws,
                losses: awayStanding.losses + awayLosses,
                goals_for: awayStanding.goals_for + awayGoals,
                goals_against: awayStanding.goals_against + homeGoals,
                goal_difference: (awayStanding.goals_for + awayGoals) - (awayStanding.goals_against + homeGoals),
              }).eq("id", awayStanding.id);
            }
          }
        }
      }

      // Atualizar rodada atual do campeonato
      await supabase
        .from("championships")
        .update({ current_round: currentRound + 1 })
        .eq("id", championship.id);

      toast.success("Resultado salvo com sucesso!");
      setTimeout(() => {
        navigate(`/jogo?time=${teamName}`);
      }, 1000);
    } catch (error) {
      console.error("Erro ao salvar resultado:", error);
      toast.error("Erro ao salvar resultado");
    }
  };

  // Timer: 90 minutos em 30 segundos reais (333ms por minuto)
  useEffect(() => {
    if (!isPlaying || minute >= 90) return;

    const interval = setInterval(() => {
      setMinute(prev => {
        const next = prev + 1;
        
        // Simular eventos aleatórios
        if (Math.random() < 0.05) {
          // Chance de gol
          if (Math.random() < 0.5) {
            setHomeScore(s => s + 1);
          } else {
            setAwayScore(s => s + 1);
          }
        }
        
        if (Math.random() < 0.15) {
          // Chutes
          if (Math.random() < 0.5) {
            setShots(s => ({ ...s, home: s.home + 1 }));
          } else {
            setShots(s => ({ ...s, away: s.away + 1 }));
          }
        }
        
        if (Math.random() < 0.08) {
          // Faltas
          if (Math.random() < 0.5) {
            setFouls(s => ({ ...s, home: s.home + 1 }));
          } else {
            setFouls(s => ({ ...s, away: s.away + 1 }));
          }
        }
        
        // Atualizar posse
        setPossession({
          home: Math.floor(40 + Math.random() * 20),
          away: Math.floor(40 + Math.random() * 20)
        });
        
        if (next >= 90) {
          setIsPlaying(false);
        }
        
        return next;
      });
    }, 333); // 30000ms / 90 = 333ms

    return () => clearInterval(interval);
  }, [isPlaying, minute]);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-border bg-black backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate(`/jogo?time=${teamName}`)}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">CAMPEONATO CARIOCA - 2025</span>
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">{Math.floor(minute / 90 * 100)}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Match Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-accent px-6 py-2 rounded-full mb-6">
            <span className="text-2xl font-bold text-black">{minute}'</span>
          </div>
        </div>

        {/* Score Board */}
        <div className="flex items-center justify-center gap-8 mb-12">
          {/* Home Team */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center p-4">
                  <img src={opponent?.logo} alt={opponentName} className="w-full h-full object-contain" />
                </div>
                <span className="text-sm font-medium text-white">{opponentName.slice(0, 3).toUpperCase()}</span>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-black border-border w-full sm:max-w-lg">
              <div className="mt-8">
                <TacticsManager teamName={opponentName} players={opponentStarters} />
              </div>
            </SheetContent>
          </Sheet>

          {/* Score */}
          <div className="flex items-center gap-6">
            <span className="text-6xl font-bold text-white">{homeScore}</span>
            <span className="text-4xl font-bold text-muted-foreground">-</span>
            <span className="text-6xl font-bold text-white">{awayScore}</span>
          </div>

          {/* Away Team */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center p-4">
                  <img src={selectedTeam?.logo} alt={teamName} className="w-full h-full object-contain" />
                </div>
                <span className="text-sm font-medium text-white">{teamName.slice(0, 3).toUpperCase()}</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-border w-full sm:max-w-lg">
              <div className="mt-8">
                <TacticsManager teamName={teamName} players={userStarters} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Stats */}
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Possession */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">{possession.home}%</span>
              <span className="text-sm font-medium text-white">Posse de bola</span>
              <span className="text-sm text-muted-foreground">{possession.away}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden flex">
              <div 
                className="bg-white transition-all duration-300" 
                style={{ width: `${possession.home}%` }}
              />
              <div 
                className="bg-accent transition-all duration-300" 
                style={{ width: `${possession.away}%` }}
              />
            </div>
          </div>

          {/* Shots */}
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-white">{shots.home}</span>
            <span className="text-sm font-medium text-white">Chutes a gol</span>
            <span className="text-2xl font-bold text-white">{shots.away}</span>
          </div>

          {/* Fouls */}
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-white">{fouls.home}</span>
            <span className="text-sm font-medium text-white">Faltas</span>
            <span className="text-2xl font-bold text-white">{fouls.away}</span>
          </div>
        </div>

        {/* Manage Button */}
        <div className="max-w-2xl mx-auto mt-12">
          <Sheet>
            <SheetTrigger asChild>
              <button className="w-full bg-accent hover:bg-accent/90 text-black font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                <span className="text-lg">GERENCIAR TIME</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-black border-border h-[90vh]">
              <div className="mt-8 overflow-y-auto h-full pb-20">
                <TacticsManager teamName={teamName} players={userStarters} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* End Match Message */}
        {minute >= 90 && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-8 max-w-md mx-4 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">FIM DE JOGO</h2>
              <div className="text-6xl font-bold text-white mb-6">
                {homeScore} - {awayScore}
              </div>
              <button
                onClick={saveMatchResult}
                disabled={isSavingMatch}
                className="w-full bg-accent hover:bg-accent/90 text-black font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSavingMatch ? "Salvando..." : "Continuar"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Match;
