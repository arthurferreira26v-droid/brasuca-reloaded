import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MatchResult = 'V' | 'E' | 'D'; // Vitória, Empate, Derrota

export const useTeamForm = (teamName: string, championshipId: string | undefined) => {
  const [form, setForm] = useState<MatchResult[]>([]);
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
          // Converter os resultados em array de 'V', 'E' ou 'D'
          const formResults: MatchResult[] = matches.map(match => {
            const isHome = match.home_team_name === teamName;
            const teamScore = isHome ? match.home_score : match.away_score;
            const opponentScore = isHome ? match.away_score : match.home_score;

            if (teamScore === null || opponentScore === null) return 'D';
            
            if (teamScore > opponentScore) return 'V'; // Vitória
            if (teamScore === opponentScore) return 'E'; // Empate
            return 'D'; // Derrota
          }); // Mantém do mais recente (esquerda) ao mais antigo (direita)

          // Preencher com 'D' se tiver menos de 5 jogos, adicionando à direita
          while (formResults.length < 5) {
            formResults.push('D');
          }

          setForm(formResults);
        } else {
          // Se não houver jogos, preencher com 'D'
          setForm(['D', 'D', 'D', 'D', 'D']);
        }
      } catch (error) {
        console.error("Erro ao buscar histórico do time:", error);
        // Em caso de erro, usar valores padrão
        setForm(['D', 'D', 'D', 'D', 'D']);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamForm();
  }, [teamName, championshipId]);

  return { form, loading };
};
