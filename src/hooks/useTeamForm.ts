import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useTeamForm = (teamName: string, championshipId: string | undefined) => {
  const [form, setForm] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamForm = async () => {
      if (!championshipId) {
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

        if (error) throw error;

        if (matches && matches.length > 0) {
          // Converter os resultados em array de booleanos (vitória = true, empate/derrota = false)
          const formResults = matches.map(match => {
            const isHome = match.home_team_name === teamName;
            const teamScore = isHome ? match.home_score : match.away_score;
            const opponentScore = isHome ? match.away_score : match.home_score;

            // Vitória = true, empate ou derrota = false
            return (teamScore !== null && opponentScore !== null) && teamScore > opponentScore;
          }).reverse(); // Reverter para mostrar do mais antigo ao mais recente

          // Preencher com false se tiver menos de 5 jogos
          while (formResults.length < 5) {
            formResults.unshift(false);
          }

          setForm(formResults);
        } else {
          // Se não houver jogos, preencher com false
          setForm([false, false, false, false, false]);
        }
      } catch (error) {
        console.error("Erro ao buscar histórico do time:", error);
        // Em caso de erro, usar valores padrão
        setForm([false, false, false, false, false]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamForm();
  }, [teamName, championshipId]);

  return { form, loading };
};
