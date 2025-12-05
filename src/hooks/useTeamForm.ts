import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MatchResult = 'V' | 'E' | 'D' | '-'; // Vitória, Empate, Derrota, Não jogado

export const useTeamForm = (teamName: string, championshipId: string | undefined) => {
  const [form, setForm] = useState<MatchResult[]>(['-', '-', '-', '-', '-']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamForm = async () => {
      if (!championshipId || !teamName) {
        setForm(['-', '-', '-', '-', '-']);
        setLoading(false);
        return;
      }

      try {
        // Buscar os últimos 5 jogos do time que já foram disputados
        const { data: matches, error } = await supabase
          .from("matches")
          .select("*")
          .eq("championship_id", championshipId)
          .eq("is_played", true)
          .or(`home_team_name.eq.${teamName},away_team_name.eq.${teamName}`)
          .order("round", { ascending: false })
          .limit(5);

        if (error) {
          console.error("Erro ao buscar histórico:", error);
          setForm(['-', '-', '-', '-', '-']);
          setLoading(false);
          return;
        }

        // Criar array de resultados com base nos jogos disputados
        const formResults: MatchResult[] = [];
        
        if (matches && matches.length > 0) {
          matches.forEach(match => {
            const isHome = match.home_team_name === teamName;
            const teamScore = isHome ? match.home_score : match.away_score;
            const opponentScore = isHome ? match.away_score : match.home_score;

            if (teamScore === null || opponentScore === null) {
              formResults.push('-');
            } else if (teamScore > opponentScore) {
              formResults.push('V'); // Vitória
            } else if (teamScore === opponentScore) {
              formResults.push('E'); // Empate
            } else {
              formResults.push('D'); // Derrota
            }
          });
        }

        // Preencher com '-' (não jogado) se tiver menos de 5 jogos
        while (formResults.length < 5) {
          formResults.push('-');
        }

        setForm(formResults);
      } catch (error) {
        console.error("Erro ao buscar histórico do time:", error);
        setForm(['-', '-', '-', '-', '-']);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamForm();
  }, [teamName, championshipId]);

  return { form, loading };
};
