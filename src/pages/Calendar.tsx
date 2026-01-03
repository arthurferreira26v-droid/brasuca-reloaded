// @ts-nocheck - Database types will be updated after migration
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { teams } from "@/data/teams";
import { useAuth } from "@/hooks/useAuth";

interface CalendarMatch {
  id: string;
  round: number;
  home_team_name: string;
  away_team_name: string;
  home_score: number | null;
  away_score: number | null;
  is_played: boolean;
  isHome: boolean;
  opponentName: string;
}

const Calendar = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teamName = searchParams.get("time") || "Botafogo";

  const [matches, setMatches] = useState<CalendarMatch[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      try {
        const userTeam = teams.find((t) => t.name === teamName);
        if (!userTeam) {
          setMatches([]);
          return;
        }

        const championshipName =
          userTeam.league === "brasileiro"
            ? `Brasileirão - ${teamName}`
            : `Liga dos Campeões - ${teamName}`;

        const { data: championship } = await supabase
          .from("championships")
          .select("id")
          .eq("name", championshipName)
          .maybeSingle();

        if (!championship) {
          setMatches([]);
          return;
        }

        const { data: allMatches } = await supabase
          .from("matches")
          .select("id, round, home_team_name, away_team_name, home_score, away_score, is_played")
          .eq("championship_id", championship.id)
          .order("round", { ascending: true });

        if (!allMatches) {
          setMatches([]);
          return;
        }

        const teamMatches: CalendarMatch[] = allMatches
          .filter(
            (match) =>
              match.home_team_name === teamName || match.away_team_name === teamName,
          )
          .map((match) => {
            const isHome = match.home_team_name === teamName;
            const opponentName = isHome ? match.away_team_name : match.home_team_name;

            return {
              id: match.id,
              round: match.round,
              home_team_name: match.home_team_name,
              away_team_name: match.away_team_name,
              home_score: match.home_score,
              away_score: match.away_score,
              is_played: match.is_played,
              isHome,
              opponentName,
            };
          });

        setMatches(teamMatches);
      } catch (error) {
        console.error("Erro ao carregar calendário:", error);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [teamName]);

  const handleBack = () => {
    navigate(`/jogo?time=${teamName}`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#c8ff00]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-border bg-black backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Calendário</h1>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <p className="text-muted-foreground">Carregando partidas...</p>
        ) : matches.length === 0 ? (
          <p className="text-muted-foreground">
            Nenhuma partida encontrada para este campeonato.
          </p>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => {
              const isHome = match.isHome;
              const homeAwayLabel = isHome ? "Em casa" : "Fora";
              const resultLabel = match.is_played
                ? `${match.home_score} x ${match.away_score}`
                : "- x -";

              return (
                <div
                  key={match.id}
                  className="flex items-center justify-between rounded-lg bg-card px-4 py-3 border border-border/60"
                >
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      {match.round}ª rodada • {homeAwayLabel}
                    </span>
                    <span className="text-sm font-medium text-white">
                      {teamName} vs {match.opponentName}
                    </span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-base font-semibold text-white">{resultLabel}</span>
                    <span className="text-[0.7rem] text-muted-foreground">
                      {match.is_played ? "Jogada" : "Próxima"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
